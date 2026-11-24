import { Component, inject, input, output, signal } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { AuthService } from '../../../services/auth-service';
import { TournamentService } from '../../../services/tournament.service';
import { TournamentStatus } from '../../../models/tournament.enums';

@Component({
  selector: 'app-tournament-management',
  standalone: true,
  imports: [ButtonDirective],
  templateUrl: './tournament-management.html',
})
export class TournamentManagement {
  private readonly authService = inject(AuthService);
  private readonly tournamentService = inject(TournamentService);

  tournamentId = input.required<number>();
  organizerId = input.required<number>();
  status = input.required<TournamentStatus>();

  tournamentUpdated = output<void>();

  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  isOrganizer(): boolean {
    return this.authService.user()?.id === this.organizerId();
  }

  openRegistrations(): void {
    this.updateStatus('open');
  }

  closeRegistrations(): void {
    this.updateStatus('close');
  }

  generateTournament(): void {
    if (!this.isOrganizer() || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.tournamentService.generateTournament(this.tournamentId()).subscribe({
      next: () => {
        this.successMessage.set('Tournament successfully generated!');
        this.loading.set(false);
        this.tournamentUpdated.emit();
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message || 'Unable to generate the tournament.'
        );
        this.loading.set(false);
      },
    });
  }

  private updateStatus(action: 'open' | 'close'): void {
    if (!this.isOrganizer() || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const request = action === 'open'
      ? this.tournamentService.openRegistrations(this.tournamentId())
      : this.tournamentService.closeRegistrations(this.tournamentId());

    request.subscribe({
      next: () => {
        this.successMessage.set(
          action === 'open'
            ? 'Registrations are now open!'
            : 'Registrations are now closed!'
        );

        this.loading.set(false);
        this.tournamentUpdated.emit();
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message || 'Unable to update tournament status.'
        );
        this.loading.set(false);
      },
    });
  }
}
