import { Component, computed, inject, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { Tag } from 'primeng/tag';
import { Tournament } from '../../../models/tournament.model';
import { TournamentStatus } from '../../../models/tournament.enums';
import { AuthService } from '../../../services/auth-service';
import { TournamentRegistration } from '../tournament-registration/tournament-registration';
import { TournamentInfoTile } from '../tournament-info-tile/tournament-info-tile';

type TagSeverity = 'success' | 'info' | 'warn' | 'secondary' | 'danger';

const STATUS_SEVERITY: Record<TournamentStatus, TagSeverity> = {
  UPCOMING: 'info',
  REGISTRATION_OPEN: 'success',
  REGISTRATION_CLOSED: 'warn',
  IN_PROGRESS: 'info',
  FINISHED: 'secondary',
  CANCELED: 'danger',
};

@Component({
  selector: 'app-tournament-overview',
  standalone: true,
  imports: [DatePipe, Card, Divider, Tag, TournamentRegistration, TournamentInfoTile, ButtonDirective, RouterLink],
  templateUrl: './tournament-overview.html',
})
export class TournamentOverview {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly tournament = input.required<Tournament>();

  readonly registrationCompleted = output<void>();

  readonly isRegistrationOpen = computed(
    () => this.tournament().status === 'REGISTRATION_OPEN',
  );

  readonly isOrganizer = computed(
    () => this.authService.user()?.id === this.tournament().organizerId,
  );

  readonly statusSeverity = computed<TagSeverity>(
    () => STATUS_SEVERITY[this.tournament().status],
  );

  label(value: string): string {
    const text = value.replace(/_/g, ' ').toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  editTournament(): void {
    this.router.navigate(['/tournaments', this.tournament().id, 'edit']);
  }
}
