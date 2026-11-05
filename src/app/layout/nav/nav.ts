import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, DividerModule],
  templateUrl: './nav.html'
})
export class Nav {
  sections = [
    {
      title: 'WORKSPACE',
      links: [
        { path: '/home', icon: '⌂', label: 'Dashboard' },
        { path: '/tournaments', icon: '🏆', label: 'Tournaments' },
        { path: '/teams', icon: '👥', label: 'Teams' },
        { path: '/matches', icon: '⚔', label: 'Matches' }
      ]
    },
    {
      title: 'MANAGEMENT',
      links: [{ path: '/settings', icon: '⚙', label: 'Settings' }]
    }
  ];
}
