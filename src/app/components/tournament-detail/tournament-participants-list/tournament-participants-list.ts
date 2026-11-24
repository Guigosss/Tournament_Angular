import { Component, computed, inject, input, output, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { catchError, of, switchMap } from 'rxjs';
import { Avatar } from 'primeng/avatar';
import { ButtonDirective } from 'primeng/button';
import { Card } from 'primeng/card';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Tag } from 'primeng/tag';
import { Badge } from 'primeng/badge';
import { ScrollArea, ScrollAreaContent, ScrollAreaHandle, ScrollAreaScrollbar, ScrollAreaViewport } from 'primeng/scrollarea';
import { Registration } from '../../../models/registration.model';
import { ParticipantType } from '../../../models/tournament.enums';
import { AuthService } from '../../../services/auth-service';
import { RegistrationService } from '../../../services/registration-service';
import { EmptyState } from '../../shared/empty-state/empty-state';

type TagSeverity = 'success' | 'info' | 'warn' | 'secondary' | 'danger';
type StatusFilter = 'ALL' | Registration['status'];

@Component({
  selector: 'app-tournament-participants-list',
  standalone: true,
  imports: [DatePipe, Avatar, Card, IconField, InputIcon, InputText, Message, Tag, ScrollArea, ScrollAreaViewport, ScrollAreaContent, ButtonDirective, ScrollAreaScrollbar, ScrollAreaHandle, Badge, EmptyState],
  host: { class: 'flex' },
  templateUrl: './tournament-participants-list.html',
})
export class TournamentParticipantsList {
  private readonly registrationService = inject(RegistrationService);
  private readonly authService = inject(AuthService);

  tournamentId = input.required<number>();
  organizerId = input.required<number>();
  participantType = input.required<ParticipantType>();

  participantUpdated = output<void>();

  loadingParticipantId = signal<number | null>(null);
  errorMessage = signal<string | null>(null);
  search = signal('');
  statusFilter = signal<StatusFilter>('ALL');

  readonly filters: { value: StatusFilter; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'VALIDATED', label: 'Validated' },
    { value: 'EXCLUDED', label: 'Excluded' },
  ];

  private readonly reloadTrigger = signal(0);

  isOrganizer = computed(
    () => this.authService.user()?.id === this.organizerId()
  );

  registrations = toSignal(
    toObservable(
      computed(() => ({ id: this.tournamentId(), reload: this.reloadTrigger() }))
    ).pipe(
      switchMap(({ id }) =>
        this.registrationService
          .getRegistrations(id)
          .pipe(catchError(() => of([] as Registration[])))
      )
    ),
    { initialValue: [] as Registration[] }
  );

  visibleRegistrations = computed(() =>
    this.isOrganizer()
      ? this.registrations()
      : this.registrations().filter((r) => r.status === 'VALIDATED')
  );

  validatedCount = computed(
    () => this.registrations().filter((r) => r.status === 'VALIDATED').length
  );

  filteredRegistrations = computed(() => {
    const query = this.search().trim().toLowerCase();
    const status = this.statusFilter();

    return this.visibleRegistrations().filter(
      (r) =>
        (status === 'ALL' || r.status === status) &&
        (!query || (r.username || r.teamName || '').toLowerCase().includes(query))
    );
  });

  readonly statusLabels: Record<Registration['status'], string> = {
    PENDING: 'Pending',
    VALIDATED: 'Validated',
    EXCLUDED: 'Excluded',
  };

  readonly statusSeverities: Record<Registration['status'], TagSeverity> = {
    PENDING: 'warn',
    VALIDATED: 'success',
    EXCLUDED: 'danger',
  };

  countFor(filter: StatusFilter): number {
    const all = this.visibleRegistrations();
    return filter === 'ALL' ? all.length : all.filter((r) => r.status === filter).length;
  }

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  validate(registration: Registration): void {
    this.updateRegistration(registration, 'validate');
  }

  exclude(registration: Registration): void {
    this.updateRegistration(registration, 'exclude');
  }

  private updateRegistration(
    registration: Registration,
    action: 'validate' | 'exclude'
  ): void {
    if (!this.isOrganizer() || this.loadingParticipantId() !== null) {
      return;
    }

    const participantId =
      this.participantType() === 'PLAYER' ? registration.userId : registration.teamId;

    if (participantId === null) {
      this.errorMessage.set('Unable to identify this participant.');
      return;
    }

    this.loadingParticipantId.set(registration.id);
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
        this.reloadTrigger.update((n) => n + 1);
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

  initials(registration: Registration): string {
    const name = registration.username || registration.teamName || '?';
    return name.slice(0, 2).toUpperCase();
  }
}
