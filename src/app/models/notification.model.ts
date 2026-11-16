export type NotificationType =
  | 'MEMBER_REMOVED'
  | 'MEMBER_LEFT'
  | 'TEAM_INVITATION';

export interface NotificationResponse {
  id: number;
  type: NotificationType;
  teamId: number | null;
  invitationId: number | null;
  message: string;
  createdAt: string;
  read: boolean;
  readAt: string | null;
}
