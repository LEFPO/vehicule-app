import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VehiculeRequest {
  marque: string;
  modele: string;
  annee: string;
  kilometrage: number;
  carburant: string;
  typeVehicule: string;
  immatriculation: string;
  attributsSpecifique: string;
}

export interface VehiculeResponse {
  id: number;
  marque: string;
  modele: string;
  annee: string;
  kilometrage: number;
  carburant: string;
  typeVehicule: string;
  immatriculation: string;
  attributsSpecifique: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class VehiculeService {
  private apiUrl = '/api/vehicules';

  constructor(private http: HttpClient) {}

  getMesVehicules(): Observable<VehiculeResponse[]> {
    return this.http.get<VehiculeResponse[]>(this.apiUrl);
  }

  getVehicule(id: number): Observable<VehiculeResponse> {
    return this.http.get<VehiculeResponse>(`${this.apiUrl}/${id}`);
  }

  creerVehicule(request: VehiculeRequest): Observable<VehiculeResponse> {
    return this.http.post<VehiculeResponse>(this.apiUrl, request);
  }

  modifierVehicule(id: number, request: VehiculeRequest): Observable<VehiculeResponse> {
    return this.http.put<VehiculeResponse>(`${this.apiUrl}/${id}`, request);
  }

  supprimerVehicule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  partagerVehicule(id: number, email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/partager`, { email });
  }
}
