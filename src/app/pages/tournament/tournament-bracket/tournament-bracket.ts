import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, of, switchMap, tap } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Message } from 'primeng/message';
import { ScrollAreaModule } from 'primeng/scrollarea'; // même import que dans tournament-participants-list.ts
import { Skeleton } from 'primeng/skeleton';
import { TournamentMatch } from '../../../models/bracket.model';
import { TournamentService } from '../../../services/tournament.service';
import { BracketRound } from '../../../components/tournament-bracket/bracket-round/bracket-round';
import { MatchResultDialog } from '../../../components/tournament-bracket/match-result-dialog/match-result-dialog';
import { EmptyState } from '../../../components/shared/empty-state/empty-state';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-tournament-bracket',
  imports: [Breadcrumb, Message, ScrollAreaModule, Skeleton, EmptyState, BracketRound, MatchResultDialog],
  templateUrl: './tournament-bracket.html',
})
export class TournamentBracket {
  private readonly authService = inject(AuthService);
  private readonly tournamentService = inject(TournamentService);

  readonly tournamentId = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));

  readonly hasError = signal(false);

  private readonly reloadTrigger = signal(0);

  readonly bracket = toSignal(
    toObservable(this.reloadTrigger).pipe(
      tap(() => this.hasError.set(false)),
      switchMap(() =>
        this.tournamentService.getTournamentBracket(this.tournamentId).pipe(
          catchError((error) => {
            console.error('Failed to load bracket', error);
            this.hasError.set(true);
            return of(null);
          }),
        ),
      ),
    ),
    { initialValue: null },
  );

  private readonly detail = toSignal(
    this.tournamentService.getTournament(this.tournamentId).pipe(catchError(() => of(null))),
    { initialValue: null },
  );

  readonly names = computed(
    () =>
      new Map(
        (this.detail()?.participants ?? []).map(
          (participant) =>
            [participant.id, participant.username ?? participant.teamName ?? 'Unknown'] as const,
        ),
      ),
  );

  readonly breadcrumb = computed<MenuItem[]>(() => [
    { label: 'Tournaments', routerLink: '/tournaments' },
    {
      label: this.detail()?.tournament.name ?? 'Tournament',
      routerLink: ['/tournaments', this.tournamentId],
    },
    { label: 'Bracket' },
  ]);

  readonly rounds = computed(() => {
    const phase = this.bracket()?.phases.find((p) => p.type === 'ELIMINATION');
    return [...(phase?.rounds ?? [])].sort((a, b) => a.orderIndex - b.orderIndex);
  });


  isOrganizer = computed(() => {
    const organizerId = this.detail()?.tournament.organizerId;
    return organizerId !== undefined && this.authService.user()?.id === organizerId;
  });

  readonly selectedMatch = signal<TournamentMatch | null>(null);
  readonly dialogVisible = signal(false);

  openResult(match: TournamentMatch): void {
    this.selectedMatch.set(match);
    this.dialogVisible.set(true);
  }

  reloadBracket(): void {
    this.reloadTrigger.update((n) => n + 1);
  }
}
