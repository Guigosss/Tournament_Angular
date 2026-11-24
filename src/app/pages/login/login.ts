import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Avatar, ButtonDirective, Card, Divider, IconField, InputIcon, InputText, Message, FormField,],
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  loginForm = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  onSubmit(): void {
    if (this.loginForm.invalid || this.loading()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/home']);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);

        if (error.status === 401) {
          this.errorMessage.set('Incorrect username or password.');
        } else if (error.status === 0) {
          this.errorMessage.set('Unable to reach the server.');
        } else if (error.status === 429) {
          this.errorMessage.set('Too many attempts. Please try again in a moment.');
        } else {
          this.errorMessage.set(
            error.error?.message ?? 'An error occurred while signing in.'
          );
        }
      }
    });
  }
}
