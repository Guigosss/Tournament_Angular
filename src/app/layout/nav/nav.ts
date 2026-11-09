import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, DividerModule],
  templateUrl: './nav.html'
})
export class Nav {
  private readonly authService = inject(AuthService);

  sections = computed(() => {
    const isAuthenticated = this.authService.user() !== null;

    return [
      {
        title: 'WORKSPACE',
        links: [
          { path: '/home', icon: '⌂', label: 'Accueil' },
          ...(isAuthenticated
            ? [{ path: '/profil', icon: '👤', label: 'Profil' }]
            : []),
          { path: '/tournaments', icon: '🏆', label: 'Tournois' },
          ...(isAuthenticated
            ? [{ path: '/teams', icon: '👥', label: 'Équipes' }]
            : []),
          { path: '/matches', icon: '⚔', label: 'Matches' }
        ]
      },
    ];
  });
}
