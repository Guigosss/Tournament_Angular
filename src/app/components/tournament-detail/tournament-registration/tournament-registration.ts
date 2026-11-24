import { Component, inject, input, output, signal } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { AuthService } from '../../../services/auth-service';
import { RegistrationService } from '../../../services/registration-service';
import { ParticipantType } from '../../../models/tournament.enums';
import {Message} from 'primeng/message';

@Component({
  selector: 'app-tournament-registration',
  standalone: true,
  imports: [Message, ButtonDirective],
  host: { class: 'flex flex-col items-start gap-2' },
  templateUrl: './tournament-registration.html'
})
export class TournamentRegistration {
  private readonly authService = inject(AuthService);
  private readonly registrationService = inject(RegistrationService);

  tournamentId = input.required<number>();
  participantType = input.required<ParticipantType>();

  registrationCompleted = output<void>();

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  loading = signal(false);

  register(): void {
    const user = this.authService.user();

    if (!user) {
      this.errorMessage.set('You must be logged in to register.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.registrationService
      .registerPlayer(this.tournamentId(), user.id)
      .subscribe({
        next: () => {
          this.successMessage.set('You have successfully registered!');
          this.registrationCompleted.emit();
          this.loading.set(false);
        },
        error: (error) => {
          this.errorMessage.set(
            error.error?.message || 'Unable to register for this tournament.'
          );
          this.loading.set(false);
        },
      });
  }
}
