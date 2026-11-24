import { PhaseType, RoundType, MatchStatus } from './tournament.enums';

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

export interface TournamentMatch {
  id: number;

  participant1: BracketParticipant | null;
  participant2: BracketParticipant | null;

  score1: number | null;
  score2: number | null;

  winner: BracketParticipant | null;

  status: MatchStatus;
  orderIndex: number;
  scheduledDate: string | null;
}

export interface BracketParticipant {
  id: number;
  userId: number | null;
  teamId: number | null;
}

export interface MatchResultRequest {
  score1: number;
  score2: number;
  winnerId: number;
}
