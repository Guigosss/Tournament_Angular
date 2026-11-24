import { Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { Message } from 'primeng/message';
import { BracketParticipant, TournamentMatch } from '../../../models/bracket.model';
import { MatchService } from '../../../services/match.service';
import {FormField} from '../../shared/form-field/form-field';

@Component({
  selector: 'app-match-result-dialog',
  imports: [ReactiveFormsModule, ButtonDirective, Dialog, InputNumber, Message, FormField, FormField],
  templateUrl: './match-result-dialog.html',
})
export class MatchResultDialog {
  private readonly matchService = inject(MatchService);

  readonly visible = model(false);
  readonly match = input<TournamentMatch | null>(null);
  readonly names = input<ReadonlyMap<number, string>>(new Map());

  readonly saved = output<void>();

  readonly saving = signal(false);
  readonly errorMessage = signal('');

  readonly player1 = computed(() => this.nameOf(this.match()?.participant1 ?? null));
  readonly player2 = computed(() => this.nameOf(this.match()?.participant2 ?? null));

  readonly form = new FormGroup({
    score1: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    score2: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
  });

  constructor() {
    effect(() => {
      if (this.visible() && this.match()) {
        this.form.reset({ score1: 0, score2: 0 });
        this.errorMessage.set('');
      }
    });
  }

  submit(): void {
    const match = this.match();

    if (!match?.participant1 || !match.participant2 || this.saving()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { score1, score2 } = this.form.getRawValue();

    if (score1 === score2) {
      this.errorMessage.set('A match cannot end in a draw: one participant must win.');
      return;
    }

    const winnerId = score1 > score2 ? match.participant1.id : match.participant2.id;

    this.saving.set(true);
    this.errorMessage.set('');

    this.matchService.submitResult(match.id, { score1, score2, winnerId }).subscribe({
      next: () => {
        this.saving.set(false);
        this.visible.set(false);
        this.saved.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.saving.set(false);
        this.errorMessage.set(error.error?.message ?? 'Unable to save the result.');
      },
    });
  }

  private nameOf(participant: BracketParticipant | null): string {
    return participant ? (this.names().get(participant.id) ?? 'Unknown') : 'TBD';
  }
}
