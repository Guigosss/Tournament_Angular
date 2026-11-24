import { Component, input } from '@angular/core';
import { Avatar } from 'primeng/avatar';

@Component({
  selector: 'app-tournament-info-tile',
  standalone: true,
  imports: [Avatar],
  host: { class: 'flex min-w-0 flex-1 flex-col gap-2 rounded-xl bg-app-surface p-4' },
  templateUrl: './tournament-info-tile.html',
})
export class TournamentInfoTile {
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
}
