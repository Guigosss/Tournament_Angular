import { RegistrationStatus } from './tournament.enums';

export interface Registration {
  id: number;
  tournamentId: number;

  userId: number | null;
  teamId: number | null;

  registerDate: string;
  status: RegistrationStatus;
}
