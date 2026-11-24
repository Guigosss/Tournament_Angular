import { AbstractControl } from '@angular/forms';

// Afficher l'erreur seulement si le champ a été touché ou modifié
export function showError(control: AbstractControl | null): boolean {
  return !!control && control.invalid && (control.touched || control.dirty);
}
