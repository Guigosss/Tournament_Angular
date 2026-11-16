import { Component, input } from '@angular/core';
import { Tournament } from '../../models/tournament.model';

@Component({
  selector: 'app-tournament-calendar',
  standalone: true,
  templateUrl: './tournament-calendar.html',
  styleUrl: './tournament-calendar.css',
})
export class TournamentCalendar {
  tournament = input.required<Tournament>();
}
