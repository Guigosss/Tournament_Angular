import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Message } from 'primeng/message';
import { showError } from '../../../utils/form';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [Message],
  host: { class: 'flex flex-col gap-2' },
  templateUrl: './form-field.html',
})
export class FormField {
  readonly label = input.required<string>();
  readonly inputId = input.required<string>();
  readonly control = input<AbstractControl | null>(null);
  readonly error = input('This field is invalid.');
  readonly hint = input<string>('');

  hasError(): boolean {
    return showError(this.control());
  }
}
