import { Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Avatar } from 'primeng/avatar';
import { ButtonDirective } from 'primeng/button';
import { Card } from 'primeng/card';
import {Tag, TagSeverity} from 'primeng/tag';
import {Tournament} from '../../../models/tournament.model';
import {MetaItem} from '../../shared/meta-item/meta-item';
import {humanize, STATUS_ACCENT, STATUS_SEVERITY} from '../../../utils/tournament-display';

@Component({
  selector: 'app-tournament-card',
  standalone: true,
  imports: [DatePipe, RouterLink, Avatar, ButtonDirective, Card, Tag, MetaItem],
  templateUrl: './tournament-card.html',
})
export class TournamentCard {
  readonly tournament = input.required<Tournament>();

  readonly humanize = humanize;

  readonly statusSeverity = computed<TagSeverity>(
    () => STATUS_SEVERITY[this.tournament().status],
  );

  readonly accent = computed(() => STATUS_ACCENT[this.tournament().status]);
}
