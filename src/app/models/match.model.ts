import { MatchStatus, RoundType } from './tournament.enums';
import { BracketParticipant } from './participant.model';

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

export interface UserMatch extends Omit<TournamentMatch, 'orderIndex'> {
  tournamentId: number;
  tournamentName: string;
  roundType: RoundType;
  myParticipantId: number | null;
}

export interface MatchResultRequest {
  score1: number;
  score2: number;
  winnerId: number;
}
