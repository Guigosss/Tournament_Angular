
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, finalize, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserResponse {
  id: number;
  username: string;
  role: unknown;
}

export interface UserTokenResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  // environment.apiUrl doit contenir la base de l'API,
  // sans ajouter /auth ici.
  private readonly apiUrl = environment.apiUrl;

  readonly user = signal<UserResponse | null>(null);

  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  login(credentials: LoginRequest): Observable<UserTokenResponse> {
    return this.http
      .post<UserTokenResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(tap(response => this.setSession(response)));
  }

  constructor() {
    const savedUser = sessionStorage.getItem('user');
    const savedAccessToken = sessionStorage.getItem('accessToken');
    const savedRefreshToken = sessionStorage.getItem('refreshToken');

    if (savedUser && savedAccessToken && savedRefreshToken) {
      try {
        this.user.set(JSON.parse(savedUser) as UserResponse);
        this.accessToken = savedAccessToken;
        this.refreshToken = savedRefreshToken;
      } catch {
        this.clearSession();
      }
    }
  }

  updateCurrentUser(username: string): void {
    this.user.update(currentUser => {
      if (!currentUser) return null;

      const updatedUser = {
        ...currentUser,
        username,
      };

      sessionStorage.setItem('user', JSON.stringify(updatedUser));

      return updatedUser;
    });
  }

  register(data: RegisterRequest): Observable<UserTokenResponse> {
    return this.http
      .post<UserTokenResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => this.setSession(response))
      );
  }

  refresh(): Observable<UserTokenResponse> {
    if (!this.refreshToken) {
      throw new Error('Aucun refresh token disponible.');
    }

    const request: RefreshTokenRequest = {
      refreshToken: this.refreshToken,
    };

    return this.http
      .post<UserTokenResponse>(`${this.apiUrl}/refresh`, request)
      .pipe(tap(response => this.setSession(response)));
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/logout`, null)
      .pipe(finalize(() => this.clearSession()));
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return this.user() !== null && this.accessToken !== null;
  }

  private setSession(response: UserTokenResponse): void {
    this.user.set(response.user);

    this.accessToken = response.accessToken;
    this.refreshToken = response.refreshToken;

    sessionStorage.setItem('user', JSON.stringify(response.user));
    sessionStorage.setItem('accessToken', response.accessToken);
    sessionStorage.setItem('refreshToken', response.refreshToken);
  }

  private clearSession(): void {
    this.user.set(null);

    this.accessToken = null;
    this.refreshToken = null;

    sessionStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
  }
}
