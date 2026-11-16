
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

    const sections = [
      {
        title: 'WORKSPACE',
        links: [
          { path: '/home', icon: '⌂', label: 'Accueil' },
          { path: '/tournaments', icon: '🏆', label: 'Tournois' },
          { path: '/matches', icon: '⚔', label: 'Matches' }
        ]
      }
    ];

    if (isAuthenticated) {
      sections.push({
        title: 'MANAGEMENT',
        links: [
          { path: '/profil', icon: '👤', label: 'Profil' },
          { path: '/teams', icon: '👥', label: 'Équipes' }
        ]
      });
    }

    return sections;
  });
}
