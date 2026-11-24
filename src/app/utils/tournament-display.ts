import { TournamentStatus } from '../models/tournament.enums';

export type TagSeverity = 'success' | 'info' | 'warn' | 'secondary' | 'danger';

export const STATUS_SEVERITY: Record<TournamentStatus, TagSeverity> = {
  UPCOMING: 'info',
  REGISTRATION_OPEN: 'success',
  REGISTRATION_CLOSED: 'warn',
  IN_PROGRESS: 'info',
  FINISHED: 'secondary',
  CANCELED: 'danger',
};

// Couleur de la barre d'accent à gauche des cartes
export const STATUS_ACCENT: Record<TournamentStatus, string> = {
  UPCOMING: 'border-l-app-primary',
  REGISTRATION_OPEN: 'border-l-app-success',
  REGISTRATION_CLOSED: 'border-l-app-warning',
  IN_PROGRESS: 'border-l-app-secondary',
  FINISHED: 'border-l-app-border',
  CANCELED: 'border-l-app-danger',
};

// SINGLE_ELIMINATION -> Single elimination
export function humanize(value: string): string {
  const text = value.replace(/_/g, ' ').toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}
