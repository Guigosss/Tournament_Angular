import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';

import { TournamentService } from '../../../services/tournament.service';
import { TournamentCard } from '../../../components/tournament-card/tournament-card';

@Component({
  selector: 'app-tournament-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink, ButtonDirective, TournamentCard],
  templateUrl: './tournament-list.html',
  styleUrl: './tournament-list.css',
})
export class TournamentList {
  private readonly tournamentService = inject(TournamentService);

  tournaments$ = this.tournamentService.getTournaments();
}
