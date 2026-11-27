
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TeamService, TeamResponse, TeamSearchResponse } from '../../services/team-service';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './teams.html',
  styleUrl: './teams.css'
})
export class Teams implements OnInit {

  private teamService = inject(TeamService);

  activeTab = signal<'my-teams' | 'discover'>('my-teams');

  // Mes équipes
  myTeams = signal<TeamResponse[]>([]);

  // Toutes les équipes disponibles
  availableTeams = signal<TeamSearchResponse[]>([]);

  // Exclure de la découverte les équipes auxquelles je participe déjà
  discoverTeams = computed(() => {
    const myTeamIds = new Set(this.myTeams().map(team => team.id));

    return this.availableTeams().filter(team => !myTeamIds.has(team.id));
  });

  // Recherche
  searchName = '';

  // Création
  newTeamName = '';

  // États de chargement
  loadingMyTeams = signal(false);
  loadingTeams = signal(false);
  creating = signal(false);

  // Messages
  myTeamsError = signal('');
  availableTeamsError = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    this.loadMyTeams();
    this.loadAvailableTeams();
  }

  loadMyTeams(): void {
    this.myTeamsError.set('');
    this.loadingMyTeams.set(true);

    this.teamService.getMine().subscribe({
      next: teams => {
        this.myTeams.set(teams);
        this.loadingMyTeams.set(false);
      },
      error: error => {
        console.error('Failed to load my teams:', error);
        this.myTeamsError.set('Unable to load your teams.');
        this.loadingMyTeams.set(false);
      }
    });
  }

  loadAvailableTeams(name?: string): void {
    this.availableTeamsError.set('');
    this.loadingTeams.set(true);

    this.teamService.search(name).subscribe({
      next: teams => {
        this.availableTeams.set(teams);
        this.loadingTeams.set(false);
      },
      error: error => {
        console.error('Failed to load available teams:', error);
        this.availableTeamsError.set('Unable to load available teams.');
        this.loadingTeams.set(false);
      }
    });
  }

  searchTeams(): void {
    this.loadAvailableTeams(this.searchName.trim() || undefined);
  }


  createTeam(): void {
    const name = this.newTeamName.trim();

    if (!name) {
      this.myTeamsError.set('Please enter a team name.');
      return;
    }

    this.creating.set(true);
    this.myTeamsError.set('');
    this.successMessage.set('');

    this.teamService.create({ name }).subscribe({
      next: () => {
        this.newTeamName = '';
        this.creating.set(false);
        this.successMessage.set('Your team has been created.');

        this.loadMyTeams();
        this.loadAvailableTeams();
      },
      error: error => {
        this.creating.set(false);
        this.myTeamsError.set(
          error.error?.message || 'Unable to create the team.'
        );
      }
    });
  }
}
