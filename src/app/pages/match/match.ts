import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ButtonDirective } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MatchService } from '../../services/match.service';
import { UserMatch } from '../../models/match.model';
import { BracketParticipant } from '../../models/participant.model';
import { ROUND_LABELS } from '../../models/tournament-options';

type MatchKind = 'play' | 'upcoming' | 'played';
type MatchFilter = 'all' | MatchKind;

@Component({
  selector: 'app-match',
  imports: [DatePipe, RouterLink, ButtonDirective, MessageModule, TableModule, TagModule],
  templateUrl: './match.html',
  host: { class: 'mx-auto flex max-w-5xl flex-col gap-6' },
})
export class Match {
  private readonly _matchService = inject(MatchService);

  readonly hasError = signal(false);
  readonly filter = signal<MatchFilter>('all');

  readonly filters: { key: MatchFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'play', label: 'To play' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'played', label: 'Played' },
  ];

  readonly matches = toSignal(
    this._matchService.getMine().pipe(
      catchError((error) => {
        console.error('Failed to load matches', error);
        this.hasError.set(true);
        return of([] as UserMatch[]);
      }),
    ),
    { initialValue: null },
  );

  private readonly allMatches = computed(() => this.matches() ?? []);

  readonly counts = computed<Record<MatchFilter, number>>(() => {
    const all = this.allMatches();
    const count = (kind: MatchKind) => all.filter((match) => this.kindOf(match) === kind).length;
    return { all: all.length, play: count('play'), upcoming: count('upcoming'), played: count('played') };
  });

  roundLabel(match: UserMatch): string {
    return ROUND_LABELS[match.roundType];
  }

  readonly visibleMatches = computed(() => {
    const order: Record<MatchKind, number> = { play: 0, upcoming: 1, played: 2 };
    const filter = this.filter();

    return this.allMatches()
      .filter((match) => filter === 'all' || this.kindOf(match) === filter)
      .sort((a, b) => order[this.kindOf(a)] - order[this.kindOf(b)]);
  });

  private kindOf(match: UserMatch): MatchKind {
    if (match.status === 'FINISHED') return 'played';
    if (match.status === 'WAITING') return 'upcoming';
    return 'play';
  }

  private isFirst(match: UserMatch): boolean {
    return match.participant1?.id === match.myParticipantId;
  }

  private opponent(match: UserMatch): BracketParticipant | null {
    return this.isFirst(match) ? match.participant2 : match.participant1;
  }

  opponentName(match: UserMatch): string | null {
    const opponent = this.opponent(match);
    return opponent?.username ?? opponent?.teamName ?? null;
  }

  private hasScore(match: UserMatch): boolean {
    return (match.score1 ?? 0) + (match.score2 ?? 0) > 0;
  }

  result(match: UserMatch): { label: string; severity: 'success' | 'danger' | 'info' | 'secondary' } {
    switch (this.kindOf(match)) {
      case 'upcoming':
        return { label: 'Upcoming', severity: 'secondary' };
      case 'play':
        return { label: 'To play', severity: 'info' };
      default: {
        const won = match.winner?.id === match.myParticipantId;
        const myScore = this.isFirst(match) ? match.score1 : match.score2;
        const opponentScore = this.isFirst(match) ? match.score2 : match.score1;
        const score = this.hasScore(match) ? ` ${myScore}–${opponentScore}` : '';
        return { label: (won ? 'Won' : 'Lost') + score, severity: won ? 'success' : 'danger' };
      }
    }
  }
}
