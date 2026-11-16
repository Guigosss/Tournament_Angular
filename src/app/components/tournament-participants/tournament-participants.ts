import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tournament-participants',
  standalone: true,
  templateUrl: './tournament-participants.html',
  styleUrl: './tournament-participants.css',
})
export class TournamentParticipants {
  participantCount = input.required<number>();
  maxParticipants = input.required<number>();
}
