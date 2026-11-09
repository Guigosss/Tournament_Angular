import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ProfilRequest, ProfilResponse } from '../models/profil.model';

@Injectable({
  providedIn: 'root',
})
export class ProfilService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getById(id: number): Observable<ProfilResponse> {
    return this.http.get<ProfilResponse>(`${this.apiUrl}/${id}`);
  }

  update(id: number, request: ProfilRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
