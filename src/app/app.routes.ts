import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
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
    canActivate: [authGuard],
  },
  {
    path: 'teams',
    loadComponent: () => import('./pages/teams/teams').then((m) => m.Teams),
    canActivate: [authGuard],
  },
  {
    path: 'tournaments',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/tournament/tournament-list/tournament-list').then((m) => m.TournamentList),
      },
      {
        path: 'new',
        loadComponent: () => import('./pages/tournament/tournament-form/tournament-form').then((m) => m.TournamentForm),
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./pages/tournament/tournament-form/tournament-form').then((m) => m.TournamentForm),
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/tournament/tournament-detail/tournament-detail').then((m) => m.TournamentDetail),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/home',
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
