import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { ButtonDirective } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { MatchService } from '../../services/match.service';
import { TournamentService } from '../../services/tournament.service';
import { UserMatch } from '../../models/match.model';
import { Tournament } from '../../models/tournament.model';
import { TOURNAMENT_STATUS_LABELS } from '../../models/tournament-options';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ButtonDirective, CardModule, ChartModule],
  templateUrl: './home.html',
  host: { class: 'mx-auto flex w-full max-w-5xl flex-col gap-8 p-6' },
})
export class Home {
  private readonly _authService = inject(AuthService);
  private readonly _matchService = inject(MatchService);
  private readonly _tournamentService = inject(TournamentService);

  readonly user = this._authService.user;
  readonly isLoggedIn = computed(() => !!this.user());

  // Data is only loaded once the user is logged in (the API requires authentication)
  readonly matches = toSignal(
    toObservable(this.isLoggedIn).pipe(
      switchMap((loggedIn) =>
        loggedIn
          ? this._matchService.getMine().pipe(catchError(() => of([] as UserMatch[])))
          : of([] as UserMatch[]),
      ),
    ),
    { initialValue: [] as UserMatch[] },
  );

  readonly tournaments = toSignal(
    toObservable(this.isLoggedIn).pipe(
      switchMap((loggedIn) =>
        loggedIn
          ? this._tournamentService.getTournaments().pipe(catchError(() => of([] as Tournament[])))
          : of([] as Tournament[]),
      ),
    ),
    { initialValue: [] as Tournament[] },
  );

  // --- Key figures ---
  private readonly played = computed(() => this.matches().filter((match) => match.status === 'FINISHED'));

  readonly playedCount = computed(() => this.played().length);
  readonly won = computed(() => this.played().filter((match) => match.winner?.id === match.myParticipantId).length);
  readonly lost = computed(() => this.playedCount() - this.won());

  readonly winRate = computed(() =>
    this.playedCount() === 0 ? null : Math.round((this.won() / this.playedCount()) * 100),
  );

  readonly toPlay = computed(
    () => this.matches().filter((match) => match.status === 'PENDING' || match.status === 'IN_PROGRESS').length,
  );

  readonly organized = computed(() => {
    const userId = this.user()?.id;
    return this.tournaments().filter((tournament) => tournament.organizerId === userId).length;
  });

  readonly nextMatch = computed(() => this.matches().find((match) => match.status === 'PENDING') ?? null);

  // --- Charts ---
  private cssVar(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  // Chart.js draws on a canvas: colors are read from the theme once the view is rendered
  private readonly colors = signal({ text: '', muted: '', border: '' });

  constructor() {
    afterNextRender(() => {
      const text = getComputedStyle(document.body).color;

      this.colors.set({
        text,
        muted: this.cssVar('--p-text-muted-color') || text,
        border: this.cssVar('--color-app-border') || this.cssVar('--p-content-border-color') || text,
      });
    });
  }

  readonly resultsData = computed(() => ({
    labels: ['Won', 'Lost'],
    datasets: [
      {
        data: [this.won(), this.lost()],
        backgroundColor: [this.cssVar('--p-green-500'), this.cssVar('--p-red-400')],
        borderWidth: 0,
      },
    ],
  }));

  readonly resultsOptions = computed(() => ({
    cutout: '65%',
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' as const, labels: { color: this.colors().text } } },
  }));

  readonly statusData = computed(() => {
    const statuses = Object.keys(TOURNAMENT_STATUS_LABELS) as (keyof typeof TOURNAMENT_STATUS_LABELS)[];

    return {
      labels: statuses.map((status) => TOURNAMENT_STATUS_LABELS[status]),
      datasets: [
        {
          data: statuses.map((status) => this.tournaments().filter((tournament) => tournament.status === status).length),
          backgroundColor: this.cssVar('--p-primary-color'),
          borderRadius: 4,
        },
      ],
    };
  });

  readonly statusOptions = computed(() => ({
    indexAxis: 'y' as const,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { precision: 0, color: this.colors().muted },
        grid: { color: this.colors().border },
      },
      y: {
        ticks: { color: this.colors().text },
        grid: { display: false },
      },
    },
  }));
}
