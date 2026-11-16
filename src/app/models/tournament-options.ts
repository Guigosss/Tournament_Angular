import { TournamentFormat, ParticipantType } from './tournament.enums';

export const TOURNAMENT_FORMATS = [
  { label: 'Élimination directe', value: 'SINGLE_ELIMINATION' as TournamentFormat },
  { label: 'Double élimination', value: 'DOUBLE_ELIMINATION' as TournamentFormat },
  { label: 'Groupes puis playoffs', value: 'GROUPS_THEN_PLAYOFF' as TournamentFormat },
];

export const PARTICIPANT_TYPES = [
  { label: 'Joueurs', value: 'PLAYER' as ParticipantType },
  { label: 'Équipes', value: 'TEAM' as ParticipantType },
];
