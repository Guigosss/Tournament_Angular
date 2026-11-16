export type TournamentStatus =
  | 'UPCOMING'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'IN_PROGRESS'
  | 'FINISHED'
  | 'CANCELED';

export type TournamentFormat =
  | 'SINGLE_ELIMINATION'
  | 'DOUBLE_ELIMINATION'
  | 'GROUPS_THEN_PLAYOFF';

export type ParticipantType =
  | 'PLAYER'
  | 'TEAM';

export type RegistrationStatus =
  | 'PENDING'
  | 'VALIDATED'
  | 'EXCLUDED';

export type PhaseType =
  | 'GROUP_STAGE'
  | 'ELIMINATION'
  | 'LOSERS_BRACKET';

export type RoundType =
  | 'ROUND_OF_128'
  | 'ROUND_OF_64'
  | 'ROUND_OF_32'
  | 'ROUND_OF_16'
  | 'QUARTER_FINAL'
  | 'SEMI_FINAL'
  | 'FINAL';

export type MatchStatus =
  | 'WAITING'
  | 'PENDING'
  | 'BYE'
  | 'IN_PROGRESS'
  | 'FINISHED';
