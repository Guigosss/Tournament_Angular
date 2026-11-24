import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { Message } from 'primeng/message';
import { TournamentService } from '../../../services/tournament.service';
import { TournamentFormat, ParticipantType } from '../../../models/tournament.enums';
import { PARTICIPANT_TYPES, TOURNAMENT_FORMATS } from '../../../models/tournament-options';
import { TournamentSchedule } from '../../../components/tournament-form/tournament-schedule/tournament-schedule';
import { TournamentGeneralInfo } from '../../../components/tournament-form/tournament-general-info/tournament-general-info';
import { toLocalDateTime } from '../../../utils/date-time';

@Component({
  selector: 'app-tournament-form',
  imports: [ReactiveFormsModule, RouterLink, ButtonDirective, Message, TournamentGeneralInfo, TournamentSchedule],
  host: { class: 'mx-auto w-full max-w-5xl p-6' },
  templateUrl: './tournament-form.html',
})
export class TournamentForm {

  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _router: Router = inject(Router);
  private readonly _route: ActivatedRoute = inject(ActivatedRoute);
  private readonly _tournamentService: TournamentService = inject(TournamentService);

  readonly errorMessage = signal<string | null>(null);
  readonly saving = signal(false);

  readonly tournamentId: number | null;
  readonly isEdit: boolean;

  form: FormGroup = this._fb.group({
    name: ['', Validators.required],
    description: ['', Validators.maxLength(500)],
    maxParticipants: [8, [Validators.required, Validators.min(2)]],
    format: ['SINGLE_ELIMINATION' as TournamentFormat, Validators.required],
    participantType: ['PLAYER' as ParticipantType, Validators.required],
    startDate: [null as Date | null, Validators.required],
    endDate: [null as Date | null, Validators.required],
    registrationStartDate: [null as Date | null, Validators.required],
    registrationEndDate: [null as Date | null, Validators.required],
  });

  readonly formats = TOURNAMENT_FORMATS;
  readonly participantTypes = PARTICIPANT_TYPES;

  constructor() {
    const id = Number(this._route.snapshot.paramMap.get('id'));
    this.tournamentId = id ? id : null;
    this.isEdit = this.tournamentId !== null;
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();

    const request = {
      ...value,
      startDate: toLocalDateTime(value.startDate),
      endDate: toLocalDateTime(value.endDate),
      registrationStartDate: toLocalDateTime(value.registrationStartDate),
      registrationEndDate: toLocalDateTime(value.registrationEndDate),
    };

    const call = this.tournamentId === null
      ? this._tournamentService.createTournament(request)
      : this._tournamentService.updateTournament(this.tournamentId, request);

    this.saving.set(true);

    call.subscribe({
      next: (tournament) => {
        this.errorMessage.set(null);
        this.saving.set(false);

        if (this.tournamentId === null) {
          this._router.navigate(['/tournaments', tournament.id]);
        } else {
          this._router.navigate(['/tournaments', this.tournamentId]);
        }
      },
      error: (error) => {
        console.error('Failed to save tournament', error);
        this.errorMessage.set('Unable to save the tournament.');
        this.saving.set(false);
      },
    });
  }
}
