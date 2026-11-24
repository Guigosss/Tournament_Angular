import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MatchResultRequest, TournamentMatch } from '../models/bracket.model';

@Injectable({ providedIn: 'root' })
export class MatchService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/matches`;

  submitResult(matchId: number, request: MatchResultRequest): Observable<TournamentMatch> {
    return this.http.patch<TournamentMatch>(`${this.apiUrl}/${matchId}/result`, request);
  }
}
