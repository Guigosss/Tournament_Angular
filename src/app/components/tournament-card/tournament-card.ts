import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from 'primeng/card';
import { ButtonDirective } from 'primeng/button';
import { Tournament } from '../../models/tournament.model';

@Component({
  selector: 'app-tournament-card',
  standalone: true,
  imports: [Card, ButtonDirective, RouterLink],
  templateUrl: './tournament-card.html',
  styleUrl: './tournament-card.css',
})
export class TournamentCard {
  tournament = input.required<Tournament>();
}
