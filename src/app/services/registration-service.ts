import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Registration } from '../models/registration.model';

@Injectable({providedIn: 'root'})
export class RegistrationService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tournaments`;

  registerPlayer(tournamentId: number, userId: number): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/${tournamentId}/registrations/players`, { userId });
  }

  validatePlayer(tournamentId: number, userId: number): Observable<unknown> {
    return this.http.patch(`${this.apiUrl}/${tournamentId}/registrations/players/${userId}/validate`, {});
  }

  excludePlayer(tournamentId: number, userId: number): Observable<unknown> {
    return this.http.patch(`${this.apiUrl}/${tournamentId}/registrations/players/${userId}/exclude`, {});
  }

  validateTeam(tournamentId: number, teamId: number): Observable<unknown> {
    return this.http.patch(`${this.apiUrl}/${tournamentId}/registrations/teams/${teamId}/validate`, {});
  }

  excludeTeam(tournamentId: number, teamId: number): Observable<unknown> {
    return this.http.patch(`${this.apiUrl}/${tournamentId}/registrations/teams/${teamId}/exclude`, {});
  }

  getRegistrations(tournamentId: number): Observable<Registration[]> {
    return this.http.get<Registration[]>(`${this.apiUrl}/${tournamentId}/registrations`);
  }
}
