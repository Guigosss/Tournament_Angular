import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage, RouterLink, ButtonModule, CardModule],
  templateUrl: './home.html'
})
export class Home {
  stats = [
    { icon: '🏆', label: 'Active Tournaments', value: 0, hint: 'Currently running' },
    { icon: '👥', label: 'Registered Teams', value: 0, hint: 'Ready to compete' },
    { icon: '⚔', label: 'Total Matches', value: 0, hint: 'Matches organized' }
  ];
}
