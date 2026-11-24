import { RegistrationStatus } from './tournament.enums';

export interface Registration {
  id: number;
  tournamentId: number;
  userId: number | null;
  username: string | null;
  teamId: number | null;
  teamName: string | null;
  registerDate: string;
  status: RegistrationStatus;
}
