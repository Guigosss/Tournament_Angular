import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Avatar } from 'primeng/avatar';
import { ButtonDirective } from 'primeng/button';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { AuthService } from '../../services/auth-service';
import { FormField } from '../../components/shared/form-field/form-field';

const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
};

const passwordByteLengthValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value ?? '';
  const byteLength = new TextEncoder().encode(value).length;

  return byteLength <= 72 ? null : { maxUtf8Bytes: true };
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Avatar, ButtonDirective, Card, Divider, IconField, InputIcon, InputText, Message, FormField],
  templateUrl: './register.html',
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  registerForm = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(50)
      ]
    }),

    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
        Validators.maxLength(254)
      ]
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(72),
        passwordByteLengthValidator
      ]
    }),

    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(72)
      ]
    })
  }, {
    validators: passwordMatchValidator
  });

  showMismatch(): boolean {
    const confirm = this.registerForm.controls.confirmPassword;
    return confirm.valid && (confirm.touched || confirm.dirty) && this.registerForm.hasError('passwordMismatch');
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.loading()) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/home']);
      },

      error: (error: HttpErrorResponse) => {
        this.loading.set(false);

        if (error.status === 409) {
          this.errorMessage.set(
            'This username or email address is already in use.'
          );
        } else if (error.status === 400) {
          this.errorMessage.set(
            error.error?.message ?? 'The information provided is invalid.'
          );
        } else if (error.status === 0) {
          this.errorMessage.set('Unable to reach the server.');
        } else {
          this.errorMessage.set(
            error.error?.message ?? 'An error occurred while creating your account.'
          );
        }
      }
    });
  }
}
