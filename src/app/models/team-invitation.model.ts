export type InvitationStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELLED';

export interface TeamInvitationResponse {
  id: number;
  teamId: number;
  teamName: string;
  playerId: number;
  status: InvitationStatus;
  createdAt: string;
  acceptedAt: string | null;
}
