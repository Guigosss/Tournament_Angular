import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TournamentStatus } from '../models/tournament.enums';
import { Observable } from 'rxjs';
import { Tournament, TournamentDetail } from '../models/tournament.model';
import { TournamentBracket } from '../models/bracket.model';

@Injectable({ providedIn: 'root' })
export class TournamentService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tournaments`;

  getTournaments(status?: TournamentStatus): Observable<Tournament[]> {
    let params = new HttpParams();

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<Tournament[]>(this.apiUrl, { params });
  }

  getTournament(id: number): Observable<TournamentDetail> {
    return this.http.get<TournamentDetail>(`${this.apiUrl}/${id}`);
  }

  createTournament(request: Tournament): Observable<Tournament> {
    return this.http.post<Tournament>(this.apiUrl, request);
  }

  updateTournament(id: number, request: Tournament): Observable<Tournament> {
    return this.http.put<Tournament>(`${this.apiUrl}/${id}`, request);
  }

  openRegistrations(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/open-registrations`, {});
  }

  closeRegistrations(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/close-registrations`, {});
  }

  generateTournament(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/generate`, {});
  }

  getTournamentBracket(id: number): Observable<TournamentBracket> {
    return this.http.get<TournamentBracket>(`${this.apiUrl}/${id}/bracket`);
  }
}
