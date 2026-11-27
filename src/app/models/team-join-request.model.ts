import { InvitationStatus } from './team-invitation.model';

export interface TeamJoinRequestResponse {
  id: number;
  teamId: number;
  teamName: string;
  playerId: number;
  username: string;
  status: InvitationStatus;
  createdAt: string;
}
