import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { TournamentService } from '../../../services/tournament.service';
import { TournamentDetail as TournamentDetailModel } from '../../../models/tournament.model';
import { TournamentOverview } from '../../../components/tournament-overview/tournament-overview';
import { TournamentParticipants } from '../../../components/tournament-participants/tournament-participants';
import { TournamentCalendar } from '../../../components/tournament-calendar/tournament-calendar';

@Component({
  selector: 'app-tournament-detail',
  standalone: true,
  imports: [ButtonDirective, TournamentOverview, TournamentParticipants, TournamentCalendar],
  templateUrl: './tournament-detail.html',
  styleUrl: './tournament-detail.css',
})
export class TournamentDetail {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
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

  editTournament(): void {
    const id = this.tournament()?.tournament.id;

    if (id) {
      this._router.navigate(['/tournaments', id, 'edit']);
    }
  }
}
