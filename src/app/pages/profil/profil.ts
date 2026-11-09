import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { ProfilService } from '../../services/profil-service';
import { NotificationResponse } from '../../models/notification.model';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-profil',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly profilService = inject(ProfilService);
  private readonly notificationService = inject(NotificationService);

  expandedNotificationId = signal<number | null>(null);
  loading = signal(false);
  saving = false;
  errorMessage = '';
  successMessage = '';

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
      this.errorMessage = 'Impossible de récupérer votre utilisateur.';
      return;
    }

    this.userId = user.id;
    this.loadProfil();
    this.loadNotifications();
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

        this.errorMessage = 'Impossible de charger votre profil.';
        this.loading.set(false);
      },
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

        this.successMessage = 'Votre pseudo a été modifié.';
        this.saving = false;
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message ?? 'Impossible de modifier votre pseudo.';
        this.saving = false;
      },
    });
  }

  loadNotifications(): void {
    this.notificationService.getMine().subscribe({
      next: notifications => {
        this.notifications.set(notifications);
      },
      error: error => {
        console.error('Erreur chargement notifications :', error);
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
        console.error('Erreur lors de la lecture de la notification :', error);
      }
    });
  }
}
