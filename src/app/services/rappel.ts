import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RappelRequest {
  typeRappel: string;
  dateRappel: string;
  kilometrage: number;
}

export interface RappelResponse {
  id: number;
  typeRappel: string;
  dateRappel: string;
  kilometrage: number;
  vehiculeId: number;
}

@Injectable({
  providedIn: 'root',
})
export class RappelService {
  constructor(private http: HttpClient) {}

  getRappels(vehiculeId: number): Observable<RappelResponse[]> {
    return this.http.get<RappelResponse[]>(`/api/vehicules/${vehiculeId}/rappels`);
  }

  creerRappel(vehiculeId: number, request: RappelRequest): Observable<RappelResponse> {
    return this.http.post<RappelResponse>(`/api/vehicules/${vehiculeId}/rappels`, request);
  }

  supprimerRappel(id: number): Observable<void> {
    return this.http.delete<void>(`/api/rappels/${id}`);
  }

  getAlertes(): Observable<RappelResponse[]> {
    return this.http.get<RappelResponse[]>('/api/rappels/alertes');
  }

  modifierStatut(id: number, typeRappel: string): Observable<RappelResponse> {
    return this.http.put<RappelResponse>(`/api/rappels/${id}`, { typeRappel });
  }
}
