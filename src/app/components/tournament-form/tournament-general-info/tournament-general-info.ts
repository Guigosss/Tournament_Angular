import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { ParticipantType, TournamentFormat } from '../../../models/tournament.enums';
import { showError } from '../../../utils/form';
import { FormSection } from '../../shared/form-section/form-section';
import { FormField } from '../../shared/form-field/form-field';

@Component({
  selector: 'app-tournament-general-info',
  standalone: true,
  imports: [ReactiveFormsModule, InputNumber, InputText, Select, Textarea, FormField, FormSection],
  templateUrl: './tournament-general-info.html',
})
export class TournamentGeneralInfo {
  form = input.required<FormGroup>();

  formats = input.required<{ label: string; value: TournamentFormat }[]>();

  participantTypes = input.required<{ label: string; value: ParticipantType }[]>();

  isInvalid(name: string): boolean {
    return showError(this.form().get(name));
  }
}
