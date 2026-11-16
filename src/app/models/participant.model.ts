import { ParticipantType, RegistrationStatus } from './tournament.enums';

export interface Participant {
  id: number;
  tournamentId: number;

  type: ParticipantType;

  userId: number | null;
  username: string | null;
  email: string | null;

  teamId: number | null;
  teamName: string | null;

  registerDate: string | null;
  status: RegistrationStatus | null;
}

export interface ParticipantRanking {
  participantId: number;
  userId: number | null;
  teamId: number | null;
  username: string | null;
  rank: number;
}
