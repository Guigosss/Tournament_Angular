import { Component, computed, input, output } from '@angular/core';
import { Card } from 'primeng/card';
import { ProgressBar } from 'primeng/progressbar';
import { TournamentStatus } from '../../../models/tournament.enums';
import { TournamentManagement } from '../tournament-management/tournament-management';

@Component({
  selector: 'app-tournament-participants',
  standalone: true,
  imports: [Card, ProgressBar, TournamentManagement],
  host: { class: 'flex' },
  templateUrl: './tournament-participants.html',
})
export class TournamentParticipants {
  tournamentId = input.required<number>();
  organizerId = input.required<number>();
  status = input.required<TournamentStatus>();

  participantCount = input.required<number>();
  maxParticipants = input.required<number>();

  participantUpdated = output<void>();

  fillPercent = computed(() => {
    const max = this.maxParticipants();
    return max > 0
      ? Math.min(100, Math.round((this.participantCount() / max) * 100))
      : 0;
  });

  spotsLeft = computed(() =>
    Math.max(0, this.maxParticipants() - this.participantCount()),
  );
}
