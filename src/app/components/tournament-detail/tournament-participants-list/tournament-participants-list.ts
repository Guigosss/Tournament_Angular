import { Component, computed, inject, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Avatar } from 'primeng/avatar';
import { ButtonDirective}  from 'primeng/button';
import { Card } from 'primeng/card';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Tag } from 'primeng/tag';
import { Participant } from '../../../models/participant.model';
import { ParticipantType } from '../../../models/tournament.enums';
import { AuthService } from '../../../services/auth-service';
import { RegistrationService } from '../../../services/registration-service';
import { ScrollArea, ScrollAreaContent, ScrollAreaHandle, ScrollAreaScrollbar, ScrollAreaViewport } from 'primeng/scrollarea';
import { Badge } from 'primeng/badge';
import { EmptyState } from '../../shared/empty-state/empty-state';

type TagSeverity = 'success' | 'info' | 'warn' | 'secondary' | 'danger';

@Component({
  selector: 'app-tournament-participants-list',
  standalone: true,
  imports: [DatePipe, Avatar, Card, IconField, InputIcon, InputText, Message, Tag, ScrollArea, ScrollAreaViewport, ScrollAreaContent, ButtonDirective, ScrollAreaScrollbar, ScrollAreaHandle, Badge, EmptyState,],
  host: { class: 'flex' },
  templateUrl: './tournament-participants-list.html',
})
export class TournamentParticipantsList {
  private readonly registrationService = inject(RegistrationService);
  private readonly authService = inject(AuthService);

  tournamentId = input.required<number>();
  organizerId = input.required<number>();
  participantType = input.required<ParticipantType>();
  participants = input.required<Participant[]>();

  participantUpdated = output<void>();

  loadingParticipantId = signal<number | null>(null);
  errorMessage = signal<string | null>(null);
  search = signal('');

  isOrganizer = computed(
    () => this.authService.user()?.id === this.organizerId()
  );

  filteredParticipants = computed(() => {
    const query = this.search().trim().toLowerCase();

    if (!query) {
      return this.participants();
    }

    return this.participants().filter((participant) =>
      (participant.username || participant.teamName || '')
        .toLowerCase()
        .includes(query)
    );
  });

  readonly statusLabels: Record<string, string> = {
    PENDING: 'Pending',
    VALIDATED: 'Validated',
    EXCLUDED: 'Excluded',
  };

  readonly statusSeverities: Record<string, TagSeverity> = {
    PENDING: 'warn',
    VALIDATED: 'success',
    EXCLUDED: 'danger',
  };

  statusLabel(status: Participant['status']): string {
    return status ? (this.statusLabels[status] ?? status) : '';
  }

  statusSeverity(status: Participant['status']): TagSeverity {
    return status ? (this.statusSeverities[status] ?? 'secondary') : 'secondary';
  }

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  validate(participant: Participant): void {
    this.updateRegistration(participant, 'validate');
  }

  exclude(participant: Participant): void {
    this.updateRegistration(participant, 'exclude');
  }

  private updateRegistration(
    participant: Participant,
    action: 'validate' | 'exclude'
  ): void {
    if (!this.isOrganizer() || this.loadingParticipantId() !== null) {
      return;
    }

    const participantId =
      this.participantType() === 'PLAYER'
        ? participant.userId
        : participant.teamId;

    if (participantId === null) {
      this.errorMessage.set('Unable to identify this participant.');
      return;
    }

    this.loadingParticipantId.set(participant.id);
    this.errorMessage.set(null);

    const request =
      this.participantType() === 'PLAYER'
        ? action === 'validate'
          ? this.registrationService.validatePlayer(this.tournamentId(), participantId)
          : this.registrationService.excludePlayer(this.tournamentId(), participantId)
        : action === 'validate'
          ? this.registrationService.validateTeam(this.tournamentId(), participantId)
          : this.registrationService.excludeTeam(this.tournamentId(), participantId);

    request.subscribe({
      next: () => {
        this.loadingParticipantId.set(null);
        this.participantUpdated.emit();
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message || 'Unable to update this registration.'
        );
        this.loadingParticipantId.set(null);
      },
    });
  }

  initials(participant: Participant): string {
    const name = participant.username || participant.teamName || '?';
    return name.slice(0, 2).toUpperCase();
  }
}
