import { TournamentStatus, TournamentFormat, ParticipantType } from './tournament.enums';
import { Participant } from './participant.model';

export interface Tournament {
  id: number;
  name: string;
  description: string;
  maxParticipants: number;

  format: TournamentFormat;
  status: TournamentStatus;
  participantType: ParticipantType;

  startDate: string;
  endDate: string;

  registrationStartDate: string;
  registrationEndDate: string;

  organizerId: number;
  organizerUsername: string;
}

export interface TournamentDetail {
  tournament: Tournament;
  participantCount: number;
  participants: Participant[];
}

export interface ParticipantCount {
  tournamentId: number;
  current: number;
  max: number;
  remaining: number;
}
