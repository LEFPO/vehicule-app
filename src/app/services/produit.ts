import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProduitRequest {
  nom: string;
  description: string;
  prix: number;
  mainDOeuvre: number;
  typeProduit: string;
}

export interface ProduitResponse {
  id: number;
  nom: string;
  description: string;
  prix: number;
  mainDOeuvre: number;
  typeProduit: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProduitService {
  private apiUrl = '/api/produits';

  constructor(private http: HttpClient) {}

  getProduits(type?: string): Observable<ProduitResponse[]> {
    const url = type ? `${this.apiUrl}?type=${type}` : this.apiUrl;
    return this.http.get<ProduitResponse[]>(url);
  }

  creerProduit(request: ProduitRequest): Observable<ProduitResponse> {
    return this.http.post<ProduitResponse>(this.apiUrl, request);
  }

  modifierProduit(id: number, request: ProduitRequest): Observable<ProduitResponse> {
    return this.http.put<ProduitResponse>(`${this.apiUrl}/${id}`, request);
  }
}
