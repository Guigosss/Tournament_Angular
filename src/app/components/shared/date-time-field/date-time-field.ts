import { Component, input } from '@angular/core';
import { FormField } from '../form-field/form-field';
import { showError } from '../../../utils/form';
import { DatePicker } from 'primeng/datepicker';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-time-field',
  standalone: true,
  imports: [ReactiveFormsModule, DatePicker, FormField],
  templateUrl: './date-time-field.html',
})
export class DateTimeField {
  readonly form = input.required<FormGroup>();
  readonly controlName = input.required<string>();
  readonly label = input.required<string>();
  readonly minDate = input<Date | null>(null);

  isInvalid(): boolean {
    return showError(this.form().get(this.controlName()));
  }
}
