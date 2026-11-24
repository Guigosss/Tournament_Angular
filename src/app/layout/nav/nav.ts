import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Menu } from 'primeng/menu';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, Avatar, Menu],
  templateUrl: './nav.html',
})
export class Nav {
  private readonly authService = inject(AuthService);

  readonly items = computed<MenuItem[]>(() => {
    const isAuthenticated = this.authService.user() !== null;

    const items: MenuItem[] = [
      {
        label: 'WORKSPACE',
        items: [
          { label: 'Home', icon: 'pi pi-home', routerLink: '/home' },
          { label: 'Tournaments', icon: 'pi pi-trophy', routerLink: '/tournaments' },
          { label: 'Matches', icon: 'pi pi-bolt', routerLink: '/matches' },
        ],
      },
    ];

    if (isAuthenticated) {
      items.push({
        label: 'MANAGEMENT',
        items: [
          { label: 'Profile', icon: 'pi pi-user', routerLink: '/profil' },
          { label: 'Teams', icon: 'pi pi-users', routerLink: '/teams' },
        ],
      });
    }

    return items;
  });
}
