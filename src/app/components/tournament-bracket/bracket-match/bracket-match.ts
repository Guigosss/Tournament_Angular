import { Component, computed, input, output } from '@angular/core';
import { Badge } from 'primeng/badge';
import { ButtonDirective } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { BracketParticipant, TournamentMatch } from '../../../models/bracket.model';
import { MATCH_STATUS_SEVERITY } from '../../../utils/match-display';
import { humanize } from '../../../utils/tournament-display';

interface MatchRow {
  name: string;
  score: number | null;
  isWinner: boolean;
  isEmpty: boolean;
}

@Component({
  selector: 'app-bracket-match',
  imports: [Badge, ButtonDirective, Tag],
  host: { class: 'match-box' },
  templateUrl: './bracket-match.html',
})
export class BracketMatch {
  readonly match = input.required<TournamentMatch>();

  readonly names = input<ReadonlyMap<number, string>>(new Map());

  readonly editable = input(false);

  readonly resultRequested = output<TournamentMatch>();

  readonly statusLabel = computed(() => humanize(this.match().status));
  readonly statusSeverity = computed(() => MATCH_STATUS_SEVERITY[this.match().status]);

  readonly canEnterResult = computed(() => this.editable() && this.match().status === 'PENDING');

  readonly showScores = computed(() => {
    const status = this.match().status;
    return status === 'IN_PROGRESS' || status === 'FINISHED';
  });

  readonly rows = computed<MatchRow[]>(() => {
    const match = this.match();

    return [
      this.toRow(match.participant1, match.score1, match),
      this.toRow(match.participant2, match.score2, match),
    ];
  });

  private toRow(
    participant: BracketParticipant | null,
    score: number | null,
    match: TournamentMatch,
  ): MatchRow {
    if (!participant) {
      return {
        name: match.status === 'BYE' ? 'BYE' : 'TBD',
        score,
        isWinner: false,
        isEmpty: true,
      };
    }

    return {
      name: this.names().get(participant.id) ?? 'Unknown',
      score,
      isWinner: match.winner?.id === participant.id,
      isEmpty: false,
    };
  }
}
