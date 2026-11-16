import { Routes } from '@angular/router';
import { authGuard } from './services/guards/auth.guard';
import { TeamDetail } from './pages/teams/team-detail/team-detail';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'profil',
    loadComponent: () => import('./pages/profil/profil').then((m) => m.Profil),
    canActivate: [authGuard]
  },
  {
    path: 'teams',
    loadComponent: () => import('./pages/teams/teams').then((m) => m.Teams),
    canActivate: [authGuard]
  },
  {
    path: 'teams/:id',
    component: TeamDetail
  },
  {
    path: 'teams/:id',
    component: TeamDetail,
    canActivate: [authGuard]
  },
];
