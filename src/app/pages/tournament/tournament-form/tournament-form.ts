import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

import { TournamentService } from '../../../services/tournament.service';
import { TournamentFormat, ParticipantType } from '../../../models/tournament.enums';
import { PARTICIPANT_TYPES, TOURNAMENT_FORMATS } from '../../../models/tournament-options';

@Component({
  selector: 'app-tournament-form',
  imports: [ReactiveFormsModule, CardModule, InputTextModule, ButtonModule, SelectModule],
  templateUrl: './tournament-form.html',
  styleUrl: './tournament-form.css',
})
export class TournamentForm {

  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _router: Router = inject(Router);
  private readonly _route: ActivatedRoute = inject(ActivatedRoute);
  private readonly _tournamentService: TournamentService = inject(TournamentService);

  readonly errorMessage = signal<string | null>(null);

  readonly tournamentId: number | null;

  form: FormGroup = this._fb.group({
    name: ['', Validators.required],
    description: ['', Validators.maxLength(500)],
    maxParticipants: [8, [Validators.required, Validators.min(2)]],
    format: ['SINGLE_ELIMINATION' as TournamentFormat, Validators.required],
    participantType: ['PLAYER' as ParticipantType, Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    registrationStartDate: ['', Validators.required],
    registrationEndDate: ['', Validators.required],
  });

  readonly formats = TOURNAMENT_FORMATS;
  readonly participantTypes = PARTICIPANT_TYPES;

  constructor() {
    const id = Number(this._route.snapshot.paramMap.get('id'));
    this.tournamentId = id ? id : null;
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const request = this.form.value;

    const call = this.tournamentId === null
      ? this._tournamentService.createTournament(request)
      : this._tournamentService.updateTournament(this.tournamentId, request);

    call.subscribe({
      next: (tournament) => {
        this.errorMessage.set(null);

        if (this.tournamentId === null) {
          this._router.navigate(['/tournaments', tournament.id]);
        } else {
          this._router.navigate(['/tournaments', this.tournamentId]);
        }
      },
      error: (error) => {
        console.error('Failed to save tournament', error);
        this.errorMessage.set('Unable to save the tournament.');
      },
    });
  }
}
