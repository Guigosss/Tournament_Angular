import { Component, computed, input, output } from '@angular/core';
import { TournamentMatch, TournamentRound } from '../../../models/bracket.model';
import { humanize } from '../../../utils/tournament-display';
import { BracketMatch } from '../bracket-match/bracket-match';

@Component({
  selector: 'app-bracket-round',
  imports: [BracketMatch],
  host: { class: 'flex w-64 shrink-0 flex-col gap-4' },
  templateUrl: './bracket-round.html',
})
export class BracketRound {
  readonly round = input.required<TournamentRound>();
  readonly names = input<ReadonlyMap<number, string>>(new Map());

  readonly hasPrevious = input(false);
  readonly hasNext = input(false);

  readonly editable = input(false);
  readonly resultRequested = output<TournamentMatch>();

  readonly title = computed(() => humanize(this.round().type));

  readonly matches = computed(() =>
    [...this.round().matches].sort((a, b) => a.orderIndex - b.orderIndex),
  );
}
