import {Component, computed, inject, signal} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/message';
import { TournamentService } from '../../../services/tournament.service';
import { TournamentDetail as TournamentDetailModel } from '../../../models/tournament.model';
import { TournamentOverview } from '../../../components/tournament-detail/tournament-overview/tournament-overview';
import { TournamentParticipants } from '../../../components/tournament-detail/tournament-participants/tournament-participants';
import { TournamentParticipantsList } from '../../../components/tournament-detail/tournament-participants-list/tournament-participants-list';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-tournament-detail',
  standalone: true,
  imports: [Message, TournamentOverview, TournamentParticipants, TournamentParticipantsList, Breadcrumb,],
  host: { class: 'page-container-wide' },
  templateUrl: './tournament-detail.html',
})
export class TournamentDetail {
  private readonly _route = inject(ActivatedRoute);
  private readonly _tournamentService = inject(TournamentService);

  readonly tournament = signal<TournamentDetailModel | null>(null);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    const id = Number(this._route.snapshot.paramMap.get('id'));

    if (!id || isNaN(id)) {
      this.errorMessage.set('Invalid tournament ID.');
      return;
    }

    this._tournamentService.getTournament(id).subscribe({
      next: (tournament) => this.tournament.set(tournament),
      error: (error) => {
        console.error('Failed to load tournament', error);
        this.errorMessage.set('Unable to load tournament.');
      }
    });
  }

  reloadTournament(): void {
    const id = Number(this._route.snapshot.paramMap.get('id'));

    this._tournamentService.getTournament(id).subscribe({
      next: (detail) => this.tournament.set(detail),
      error: (error) => console.error('Unable to reload tournament', error),
    });
  }

  readonly breadcrumb = computed<MenuItem[]>(() => [
    { label: 'Tournaments', routerLink: '/tournaments' },
    { label: this.tournament()?.tournament.name ?? '…' },
  ]);

  readonly registeredCount = computed(
    () => this.tournament()?.participants.filter((p) => p.status !== 'EXCLUDED').length ?? 0,
  );
}
