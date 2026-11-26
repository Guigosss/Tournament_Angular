import { PhaseType, RoundType } from './tournament.enums';
import { TournamentMatch } from './match.model';

export interface TournamentBracket {
  tournamentId: number;
  phases: TournamentPhase[];
}

export interface TournamentPhase {
  id: number;
  type: PhaseType;
  orderIndex: number;
  rounds: TournamentRound[];
}

export interface TournamentRound {
  id: number;
  type: RoundType;
  orderIndex: number;
  matches: TournamentMatch[];
}
