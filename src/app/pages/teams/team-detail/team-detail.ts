
import { Component, OnInit, DestroyRef, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TeamService, TeamResponse } from '../../../services/team-service';
import { AuthService } from '../../../services/auth-service';
import { ProfilService } from '../../../services/profil-service';
import { TeamInvitationService } from '../../../services/team-invitation-service';
import { ProfilResponse } from '../../../models/profil.model';
import { TeamJoinRequestService } from '../../../services/team-join-request-service';
import { TeamJoinRequestResponse } from '../../../models/team-join-request.model';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './team-detail.html',
  styleUrl: './team-detail.css'
})
export class TeamDetail implements OnInit {

  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private joinRequestService = inject(TeamJoinRequestService);
  private teamService = inject(TeamService);
  private authService = inject(AuthService);
  private profilService = inject(ProfilService);
  private invitationService = inject(TeamInvitationService);
  private searchTerms = new Subject<string>();

  showInvitationForm = signal(false);
  team = signal<TeamResponse | null>(null);
  loading = signal(false);
  errorMessage = signal('');

  // Invitation
  isCaptain = computed(() =>
    this.team()?.captain?.id === this.authService.user()?.id
  );

  searchName = signal('');
  players = signal<ProfilResponse[]>([]);
  searchingPlayers = signal(false);
  searchError = signal('');

  invitingPlayerId = signal<number | null>(null);
  invitedPlayerIds = signal<Set<number>>(new Set());

  invitationSuccess = signal('');
  invitationError = signal('');

  // Exclut les joueurs déjà membres de l'équipe
  availablePlayers = computed(() => {
    const members = new Set(
      this.team()?.members.map(member => member.id) ?? []
    );

    return this.players().filter(player => !members.has(player.id));
  });

  myJoinRequests = signal<TeamJoinRequestResponse[]>([]);

  loadingJoinRequest = signal(false);
  joinRequestError = signal('');
  joinRequestSuccess = signal('');

  isMember = computed(() => {
    const userId = this.authService.user()?.id;

    return !!userId &&
      (this.team()?.members.some(member => member.id === userId) ?? false);
  });

  hasPendingJoinRequest = computed(() => {
    const teamId = this.team()?.id;

    return !!teamId && this.myJoinRequests().some(
      request => request.teamId === teamId && request.status === 'PENDING'
    );
  });

  loadMyJoinRequests(): void {
    this.joinRequestService.getMine().subscribe({
      next: requests => {
        this.myJoinRequests.set(requests);
      },
      error: error => {
        console.error('Erreur chargement des demandes :', error);
      }
    });
  }

  requestToJoin(): void {
    const teamId = this.team()?.id;

    if (!teamId || this.isMember() || this.isCaptain() ||
      this.hasPendingJoinRequest()) {
      return;
    }

    this.loadingJoinRequest.set(true);
    this.joinRequestError.set('');
    this.joinRequestSuccess.set('');

    this.joinRequestService.submit(teamId).subscribe({
      next: request => {
        this.myJoinRequests.update(requests => [...requests, request]);

        this.joinRequestSuccess.set(
          'Votre demande a été envoyée au capitaine de cette équipe.'
        );

        this.loadingJoinRequest.set(false);
      },
      error: error => {
        console.error('Erreur demande de rejoindre :', error);

        this.joinRequestError.set(
          error.error?.message || 'Impossible d’envoyer votre demande.'
        );

        this.loadingJoinRequest.set(false);
      }
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMyJoinRequests();

    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage.set('Identifiant d’équipe invalide.');
      return;
    }

    this.setupPlayerSearch();
    this.loadTeam(id);
  }

  private loadTeam(id: number): void {
    this.loading.set(true);

    this.teamService.getById(id).subscribe({
      next: team => {
        this.team.set(team);
        this.loading.set(false);
      },
      error: error => {
        console.error('Erreur chargement équipe :', error);
        this.errorMessage.set('Impossible de récupérer cette équipe.');
        this.loading.set(false);
      }
    });
  }

  private setupPlayerSearch(): void {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(username => {
        if (username.length < 2) {
          this.players.set([]);
          this.searchError.set('');
          this.searchingPlayers.set(false);
          return of([]);
        }

        this.searchingPlayers.set(true);
        this.searchError.set('');

        return this.profilService.searchPlayers(username).pipe(
          catchError(error => {
            console.error('Erreur recherche joueurs :', error);
            this.searchError.set('Impossible de rechercher les joueurs.');
            return of([]);
          }),
          finalize(() => this.searchingPlayers.set(false))
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(players => {
      this.players.set(players);
    });
  }

  searchPlayers(username: string): void {
    this.searchName.set(username);
    this.invitationSuccess.set('');
    this.invitationError.set('');
    this.searchTerms.next(username.trim());
  }

  invitePlayer(player: ProfilResponse): void {
    const teamId = this.team()?.id;

    if (!teamId || !this.isCaptain()) {
      return;
    }

    this.invitingPlayerId.set(player.id);
    this.invitationSuccess.set('');
    this.invitationError.set('');

    this.invitationService.invite(teamId, player.id).subscribe({
      next: () => {
        this.invitedPlayerIds.update(ids => {
          const updated = new Set(ids);
          updated.add(player.id);
          return updated;
        });

        this.invitationSuccess.set(
          `Invitation envoyée à ${player.name}.`
        );

        this.invitingPlayerId.set(null);
      },
      error: error => {
        console.error('Erreur invitation :', error);

        this.invitationError.set(
          error.error?.message || 'Impossible d’envoyer l’invitation.'
        );

        this.invitingPlayerId.set(null);
      }
    });
  }
}
