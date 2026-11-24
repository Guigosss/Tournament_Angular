import { Component, input } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { Stat } from '../../../models/stat.model';

@Component({
  selector: 'app-tournament-list-header',
  standalone: true,
  imports: [LowerCasePipe, RouterLink, ButtonDirective],
  host: { class: 'mb-8 block' },
  templateUrl: './tournament-list-header.html',
})
export class TournamentListHeader {
  readonly stats = input<Stat[] | null>(null);
}
