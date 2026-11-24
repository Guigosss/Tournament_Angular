import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ButtonDirective } from 'primeng/button';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';
import { TournamentService } from '../../../services/tournament.service';
import { Tournament } from '../../../models/tournament.model';
import { TournamentStatus } from '../../../models/tournament.enums';
import { EmptyState } from '../../../components/shared/empty-state/empty-state';
import { TournamentCard } from '../../../components/tournament-list/tournament-card/tournament-card';
import { TournamentFilters } from '../../../components/tournament-list/tournament-filters/tournament-filters';
import { Stat } from '../../../components/tournament-list/tournament-stat/tournament-stat';
import { TournamentListHeader } from '../../../components/tournament-list/tournament-list-header/tournament-list-header';

@Component({
  selector: 'app-tournament-list',
  standalone: true,
  imports: [RouterLink, ButtonDirective, Message, Skeleton, EmptyState, TournamentCard, TournamentFilters, TournamentListHeader,],
  templateUrl: './tournament-list.html',
})
export class TournamentList {
  private readonly tournamentService = inject(TournamentService);

  readonly hasError = signal(false);
  readonly search = signal('');
  readonly statusFilter = signal<TournamentStatus | null>(null);

  readonly tournaments = toSignal(
    this.tournamentService.getTournaments().pipe(
      catchError((error) => {
        console.error('Failed to load tournaments', error);
        this.hasError.set(true);
        return of([] as Tournament[]);
      }),
    ),
    { initialValue: null },
  );

  readonly stats = computed<Stat[]>(() => {
    const list = this.tournaments() ?? [];

    return [
      { label: 'Tournaments', value: list.length, icon: 'pi pi-trophy' },
      {
        label: 'Open for registration',
        value: list.filter((t) => t.status === 'REGISTRATION_OPEN').length,
        icon: 'pi pi-user-plus',
      },
      {
        label: 'In progress',
        value: list.filter((t) => t.status === 'IN_PROGRESS').length,
        icon: 'pi pi-play-circle',
      },
    ];
  });

  readonly filteredTournaments = computed(() => {
    const query = this.search().trim().toLowerCase();
    const status = this.statusFilter();

    return (this.tournaments() ?? []).filter(
      (tournament) =>
        (!status || tournament.status === status) &&
        (!query ||
          tournament.name.toLowerCase().includes(query) ||
          (tournament.description ?? '').toLowerCase().includes(query)),
    );
  });
}
