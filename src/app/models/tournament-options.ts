import { TournamentFormat, ParticipantType, RoundType, TournamentStatus } from './tournament.enums';

export const TOURNAMENT_FORMATS = [
  { label: 'Single elimination', value: 'SINGLE_ELIMINATION' as TournamentFormat },
  //- { label: 'Double elimination', value: 'DOUBLE_ELIMINATION' as TournamentFormat },
  //- { label: 'Groups then playoffs', value: 'GROUPS_THEN_PLAYOFF' as TournamentFormat },
];

export const PARTICIPANT_TYPES = [
  { label: 'Players', value: 'PLAYER' as ParticipantType },
  { label: 'Teams', value: 'TEAM' as ParticipantType },
];

export const ROUND_LABELS: Record<RoundType, string> = {
  ROUND_OF_128: 'Round of 128',
  ROUND_OF_64: 'Round of 64',
  ROUND_OF_32: 'Round of 32',
  ROUND_OF_16: 'Round of 16',
  QUARTER_FINAL: 'Quarter final',
  SEMI_FINAL: 'Semi final',
  FINAL: 'Final',
};

export const TOURNAMENT_STATUS_LABELS: Record<TournamentStatus, string> = {
  UPCOMING: 'Upcoming',
  REGISTRATION_OPEN: 'Registration open',
  REGISTRATION_CLOSED: 'Registration closed',
  IN_PROGRESS: 'In progress',
  FINISHED: 'Finished',
  CANCELED: 'Canceled',
};
