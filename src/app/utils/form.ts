import { AbstractControl } from '@angular/forms';

export function showError(control: AbstractControl | null): boolean {
  return !!control && control.invalid && (control.touched || control.dirty);
}
