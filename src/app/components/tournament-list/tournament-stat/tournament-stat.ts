import { Component, input } from '@angular/core';
import { Avatar } from 'primeng/avatar';

export interface Stat {
  label: string;
  value: number | string;
  icon: string;
}

@Component({
  selector: 'app-tournament-stat',
  imports: [Avatar],
  host: { class: 'glass-tile' },
  templateUrl: './tournament-stat.html',
})
export class TournamentStat {
  readonly icon = input.required<string>();
  readonly value = input.required<number | string>();
  readonly label = input.required<string>();
}
