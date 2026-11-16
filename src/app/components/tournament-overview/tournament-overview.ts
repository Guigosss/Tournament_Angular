import { Component, input } from '@angular/core';
import { Tournament } from '../../models/tournament.model';

@Component({
  selector: 'app-tournament-overview',
  standalone: true,
  templateUrl: './tournament-overview.html',
  styleUrl: './tournament-overview.css',
})
export class TournamentOverview {
  tournament = input.required<Tournament>();
}
