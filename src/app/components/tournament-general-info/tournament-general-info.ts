import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ParticipantType, TournamentFormat } from '../../models/tournament.enums';
import { StyleClass } from 'primeng/styleclass';

@Component({
  selector: 'app-tournament-general-info',
  standalone: true,
  imports: [ReactiveFormsModule, InputText, Select, StyleClass],
  templateUrl: './tournament-general-info.html',
  styleUrl: './tournament-general-info.css',
})
export class TournamentGeneralInfo {
  form = input.required<FormGroup>();

  formats = input.required<{ label: string; value: TournamentFormat }[]>();

  participantTypes = input.required<{ label: string; value: ParticipantType }[]>();
}
