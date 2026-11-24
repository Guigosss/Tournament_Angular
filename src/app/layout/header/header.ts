import { Component, computed, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { ButtonDirective } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, Avatar, ButtonDirective, Menu],
  templateUrl: './header.html',
})
export class Header {
  protected readonly authService = inject(AuthService);

  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  protected readonly initials = computed(() =>
    (this.authService.user()?.username ?? '?').slice(0, 2).toUpperCase(),
  );

  protected readonly userMenu: MenuItem[] = [
    { label: 'Profil', icon: 'pi pi-user', routerLink: '/profil' },
    { label: 'Équipes', icon: 'pi pi-users', routerLink: '/teams' },
    { separator: true },
    { label: 'Déconnexion', icon: 'pi pi-sign-out', command: () => this.logout() },
  ];

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Déconnexion réussie',
          detail: 'À bientôt sur Tournament App !',
          life: 3000
        });

        this.router.navigate(['/home']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'La déconnexion a rencontré un problème.',
          life: 3000
        });
      }
    });
  }
}
