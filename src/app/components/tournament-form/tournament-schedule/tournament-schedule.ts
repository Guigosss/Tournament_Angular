import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DateTimeField } from '../../shared/date-time-field/date-time-field';
import { FormSection } from '../../shared/form-section/form-section';

@Component({
  selector: 'app-tournament-schedule',
  standalone: true,
  imports: [DateTimeField, FormSection],
  templateUrl: './tournament-schedule.html',
})
export class TournamentSchedule {
  form = input.required<FormGroup>();
}
