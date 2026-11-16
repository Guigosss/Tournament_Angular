import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TournamentService } from '../../../services/tournament.service';
import {Card} from 'primeng/card';

@Component({
  selector: 'app-tournament-list',
  standalone: true,
  imports: [AsyncPipe, Card],
  templateUrl: './tournament-list.html',
  styleUrl: './tournament-list.css',
})
export class TournamentList {

  private tournamentService = inject(TournamentService);

  tournaments$ = this.tournamentService.getTournaments();

}
