
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TeamInvitationResponse } from '../models/team-invitation.model';

@Injectable({
  providedIn: 'root'
})
export class TeamInvitationService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getMine(): Observable<TeamInvitationResponse[]> {
    return this.http.get<TeamInvitationResponse[]>(
      `${this.apiUrl}/invitations`
    );
  }

  accept(invitationId: number): Observable<TeamInvitationResponse> {
    return this.http.post<TeamInvitationResponse>(
      `${this.apiUrl}/invitations/${invitationId}/accept`,
      null
    );
  }

  reject(invitationId: number): Observable<TeamInvitationResponse> {
    return this.http.post<TeamInvitationResponse>(
      `${this.apiUrl}/invitations/${invitationId}/reject`,
      null
    );
  }
}
