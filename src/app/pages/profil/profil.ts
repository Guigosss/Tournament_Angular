import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { ProfilService } from '../../services/profil-service';
import { NotificationResponse } from '../../models/notification.model';
import { NotificationService } from '../../services/notification-service';
import { TeamInvitationService } from '../../services/team-invitation-service';
import { TeamJoinRequestService } from '../../services/team-join-request-service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-profil',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil implements OnInit {
  private readonly invitationService = inject(TeamInvitationService);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly profilService = inject(ProfilService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly joinRequestService = inject(TeamJoinRequestService);

  expandedNotificationId = signal<number | null>(null);
  loading = signal(false);
  saving = false;
  errorMessage = '';
  successMessage = '';
  activeTab = signal<'account' | 'notifications'>('account');
  deleting = false;
  showDeleteModal = signal(false);
  // Identifiants des invitations encore en attente
  invitationStatuses = signal<Map<number, 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED'>>(
    new Map()
  );

  // Statuts des demandes pour rejoindre une équipe
  joinRequestStatuses = signal<
    Map<number, 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED'>
  >(new Map());

  loadingJoinRequests = signal(false);
  joinRequestActionLoadingId = signal<number | null>(null);
  joinRequestActionError = signal('');

  loadingInvitations = signal(false);
  invitationActionLoadingId = signal<number | null>(null);
  invitationActionError = signal('');

  private userId: number | null = null;

  profilForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.maxLength(50)]],
  });

  notifications = signal<NotificationResponse[]>([]);

  unreadCount = computed(
    () => this.notifications().filter(notification => !notification.read).length
  );

  ngOnInit(): void {
    const user = this.authService.user();

    if (!user) {
      this.errorMessage = 'Unable to retrieve your user.';
      return;
    }

    this.userId = user.id;
    this.loadProfil();
    this.loadNotifications();
    this.loadMyInvitations();
  }

  confirmDeleteAccount(): void {
    this.showDeleteModal.set(true);
  }

  acceptInvitation(notification: NotificationResponse): void {
    const invitationId = notification.invitationId;

    if (invitationId === null || this.invitationActionLoadingId() !== null) {
      return;
    }

    this.invitationActionError.set('');
    this.invitationActionLoadingId.set(invitationId);

    this.invitationService.accept(invitationId).subscribe({
      next: () => {
        this.completeInvitationAction(invitationId, 'ACCEPTED');
      },
      error: error => {
        console.error('Failed to accept invitation:', error);
        this.invitationActionError.set(
          error.error?.message ?? 'Unable to accept the invitation.'
        );
        this.invitationActionLoadingId.set(null);
      }
    });
  }

  rejectInvitation(notification: NotificationResponse): void {
    const invitationId = notification.invitationId;

    if (invitationId === null || this.invitationActionLoadingId() !== null) {
      return;
    }

    this.invitationActionError.set('');
    this.invitationActionLoadingId.set(invitationId);

    this.invitationService.reject(invitationId).subscribe({
      next: () => {
        this.completeInvitationAction(invitationId, 'REJECTED');
      },
      error: error => {
        console.error('Failed to decline invitation:', error);
        this.invitationActionError.set(
          error.error?.message ?? 'Unable to decline the invitation.'
        );
        this.invitationActionLoadingId.set(null);
      }
    });
  }

  private completeInvitationAction(
    invitationId: number,
    status: 'ACCEPTED' | 'REJECTED'
  ): void {
    this.invitationStatuses.update(statuses => {
      const updated = new Map(statuses);
      updated.set(invitationId, status);
      return updated;
    });

    this.invitationActionLoadingId.set(null);
  }

  deleteAccount(): void {
    if (this.userId === null || this.deleting) return;

    this.deleting = true;
    this.errorMessage = '';

    this.profilService.delete(this.userId).subscribe({
      next: () => {
        this.authService.clearSession();
        this.router.navigate(['/login']);
      },
      error: error => {
        this.errorMessage =
          error.error?.message ?? 'Unable to delete your account.';

        this.deleting = false;
        this.showDeleteModal.set(false);
      }
    });
  }

  loadProfil(): void {
    if (this.userId === null) return;

    this.loading.set(true);

    this.profilService.getById(this.userId).subscribe({
      next: profil => {

        this.profilForm.patchValue({
          username: profil.name
        });

        this.loading.set(false);
      },
      error: error => {

        this.errorMessage = 'Unable to load your profile.';
        this.loading.set(false);
      },
    });
  }

  loadMyInvitations(): void {
    this.loadingInvitations.set(true);

    this.invitationService.getMine().subscribe({
      next: invitations => {
        const statuses = new Map<
          number,
          'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED'
        >();

        invitations.forEach(invitation => {
          statuses.set(invitation.id, invitation.status);
        });

        this.invitationStatuses.set(statuses);
        this.loadingInvitations.set(false);
      },
      error: error => {
        console.error('Failed to load invitations:', error);
        this.invitationActionError.set(
          'Unable to load your invitations.'
        );
        this.loadingInvitations.set(false);
      }
    });
  }

  loadMyJoinRequests(): void {
    const teamIds = [
      ...new Set(
        this.notifications()
          .filter(n => n.type === 'TEAM_JOIN_REQUEST' && n.teamId !== null)
          .map(n => n.teamId!)
      )
    ];

    if (teamIds.length === 0) {
      this.joinRequestStatuses.set(new Map());
      return;
    }

    this.loadingJoinRequests.set(true);

    forkJoin(
      teamIds.map(teamId => this.joinRequestService.getForTeam(teamId))
    ).subscribe({
      next: results => {
        const statuses = new Map<
          number,
          'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED'
        >();

        results.flat().forEach(request => {
          statuses.set(request.id, request.status);
        });

        this.joinRequestStatuses.set(statuses);
        this.loadingJoinRequests.set(false);
      },
      error: error => {
        console.error('Failed to load join requests:', error);
        this.joinRequestActionError.set(
          'Unable to load join requests.'
        );
        this.loadingJoinRequests.set(false);
      }
    });
  }

  private completeJoinRequestAction(
    requestId: number,
    status: 'ACCEPTED' | 'REJECTED'
  ): void {
    this.joinRequestStatuses.update(statuses => {
      const updated = new Map(statuses);
      updated.set(requestId, status);
      return updated;
    });

    this.joinRequestActionLoadingId.set(null);
  }

  acceptJoinRequest(notification: NotificationResponse): void {
    const requestId = notification.joinRequestId;

    if (requestId === null || this.joinRequestActionLoadingId() !== null) {
      return;
    }

    this.joinRequestActionError.set('');
    this.joinRequestActionLoadingId.set(requestId);

    this.joinRequestService.accept(requestId).subscribe({
      next: () => {
        this.completeJoinRequestAction(requestId, 'ACCEPTED');
      },
      error: error => {
        console.error('Failed to accept join request:', error);
        this.joinRequestActionError.set(
          error.error?.message ?? 'Unable to accept the request.'
        );
        this.joinRequestActionLoadingId.set(null);
      }
    });
  }

  rejectJoinRequest(notification: NotificationResponse): void {
    const requestId = notification.joinRequestId;

    if (requestId === null || this.joinRequestActionLoadingId() !== null) {
      return;
    }

    this.joinRequestActionError.set('');
    this.joinRequestActionLoadingId.set(requestId);

    this.joinRequestService.reject(requestId).subscribe({
      next: () => {
        this.completeJoinRequestAction(requestId, 'REJECTED');
      },
      error: error => {
        console.error('Failed to decline join request:', error);
        this.joinRequestActionError.set(
          error.error?.message ?? 'Unable to decline the request.'
        );
        this.joinRequestActionLoadingId.set(null);
      }
    });
  }

  updateProfil(): void {
    if (this.profilForm.invalid || this.userId === null) {
      this.profilForm.markAllAsTouched();
      return;
    }

    const username = this.profilForm.getRawValue().username.trim();

    if (!username) return;

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.profilService.update(this.userId, { username }).subscribe({
      next: () => {
        this.authService.updateCurrentUser(username);

        this.successMessage = 'Your username has been updated.';
        this.saving = false;
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message ?? 'Unable to update your username.';
        this.saving = false;
      },
    });
  }

  loadNotifications(): void {
    this.notificationService.getMine().subscribe({
      next: notifications => {
        this.notifications.set(notifications);
        this.loadMyJoinRequests();
      },
      error: error => {
        console.error('Failed to load notifications:', error);
      }
    });
  }

  openNotification(notification: NotificationResponse): void {
    // Fermer la notification si elle est déjà ouverte
    if (this.expandedNotificationId() === notification.id) {
      this.expandedNotificationId.set(null);
      return;
    }

    // Ouvrir la notification
    this.expandedNotificationId.set(notification.id);

    // Ne rien faire si elle est déjà lue
    if (notification.read) return;

    // Marquer comme lue dans le backend
    this.notificationService.markRead(notification.id).subscribe({
      next: updatedNotification => {
        this.notifications.update(notifications =>
          notifications.map(item =>
            item.id === updatedNotification.id
              ? updatedNotification
              : item
          )
        );
      },
      error: error => {
        console.error('Failed to mark notification as read:', error);
      }
    });
  }
}
