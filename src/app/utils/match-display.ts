import { TagSeverity } from 'primeng/tag';
import { MatchStatus } from '../models/tournament.enums';

export const MATCH_STATUS_SEVERITY: Record<MatchStatus, TagSeverity> = {
  WAITING: 'secondary',
  PENDING: 'info',
  BYE: 'contrast',
  IN_PROGRESS: 'warn',
  FINISHED: 'success',
};
