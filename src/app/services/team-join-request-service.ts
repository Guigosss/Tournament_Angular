
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TeamJoinRequestResponse } from '../models/team-join-request.model';

@Injectable({
  providedIn: 'root'
})
export class TeamJoinRequestService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  submit(teamId: number): Observable<TeamJoinRequestResponse> {
    return this.http.post<TeamJoinRequestResponse>(
      `${this.apiUrl}/teams/${teamId}/join-requests`,
      null
    );
  }

  getMine(): Observable<TeamJoinRequestResponse[]> {
    return this.http.get<TeamJoinRequestResponse[]>(
      `${this.apiUrl}/join-requests`
    );
  }

  getForTeam(teamId: number): Observable<TeamJoinRequestResponse[]> {
    return this.http.get<TeamJoinRequestResponse[]>(
      `${this.apiUrl}/teams/${teamId}/join-requests`
    );
  }

  accept(requestId: number): Observable<TeamJoinRequestResponse> {
    return this.http.post<TeamJoinRequestResponse>(
      `${this.apiUrl}/join-requests/${requestId}/accept`,
      null
    );
  }

  reject(requestId: number): Observable<TeamJoinRequestResponse> {
    return this.http.post<TeamJoinRequestResponse>(
      `${this.apiUrl}/join-requests/${requestId}/reject`,
      null
    );
  }
}
