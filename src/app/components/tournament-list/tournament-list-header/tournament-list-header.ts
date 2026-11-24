import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { Stat, TournamentStat } from '../tournament-stat/tournament-stat';

@Component({
  selector: 'app-tournament-list-header',
  standalone: true,
  imports: [RouterLink, ButtonDirective, TournamentStat],
  host: { class: 'block' },
  templateUrl: './tournament-list-header.html',
})
export class TournamentListHeader {
  readonly stats = input<Stat[] | null>(null);
}
