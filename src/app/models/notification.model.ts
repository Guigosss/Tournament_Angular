export type NotificationType =
  | 'MEMBER_REMOVED'
  | 'MEMBER_LEFT'
  | 'TEAM_INVITATION'
  | 'TEAM_JOIN_REQUEST';

export interface NotificationResponse {
  id: number;
  type: NotificationType;
  teamId: number | null;
  invitationId: number | null;
  joinRequestId: number | null;
  message: string;
  createdAt: string;
  read: boolean;
  readAt: string | null;
}
