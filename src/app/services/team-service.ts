import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TeamPlayer {
  id: number;
  username: string;
}

export interface TeamResponse {
  id: number;
  name: string;
  numberOfWins: number;
  teamSize: number;
  captain: TeamPlayer | null;
  members: TeamPlayer[];
  archived: boolean;
}

export interface TeamSearchResponse {
  id: number;
  name: string;
  numberOfWins: number;
  teamSize: number;
  archived: boolean;
}

export interface TeamCreateRequest {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/teams`;

  // Rechercher les équipes disponibles
  search(name?: string): Observable<TeamSearchResponse[]> {
    return this.http.get<TeamSearchResponse[]>(
      `${this.apiUrl}/search`,
      { params: name ? { name } : {} }
    );
  }

  // Récupérer mes équipes
  getMine(): Observable<TeamResponse[]> {
    return this.http.get<TeamResponse[]>(`${this.apiUrl}/mine`);
  }

  // Récupérer une équipe par son identifiant
  getById(id: number): Observable<TeamResponse> {
    return this.http.get<TeamResponse>(`${this.apiUrl}/${id}`);
  }

  // Créer une équipe
  create(request: TeamCreateRequest): Observable<TeamResponse> {
    return this.http.post<TeamResponse>(this.apiUrl, request);
  }
}

