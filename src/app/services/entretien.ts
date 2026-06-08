import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProduitResponse } from './produit';

export interface EntretienRequest {
  typeEntretien: string;
  date: string;
  note: string;
  cout: number;
}

export interface EntretienResponse {
  id: number;
  typeEntretien: string;
  date: string;
  note: string;
  cout: number;
  vehiculeId: number;
}

export interface CoutEstime {
  total: number;
  detail: { produit: ProduitResponse; quantite: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class EntretienService {
  private produitsParType: { [key: string]: { type: string; quantite: number }[] } = {
    PetitEntretien: [
      { type: 'HuileMoteur', quantite: 1 },
      { type: 'FiltreHuile', quantite: 1 },
    ],
    GrandEntretien: [
      { type: 'HuileMoteur', quantite: 1 },
      { type: 'FiltreHuile', quantite: 1 },
      { type: 'PlaquetteFrein', quantite: 1 },
      { type: 'DisqueFrein', quantite: 1 },
      { type: 'LiquideFrein', quantite: 1 },
    ],
    PreventionEntretien: [
      { type: 'LiquideRefroidissement', quantite: 1 },
      { type: 'Batterie', quantite: 1 },
    ],
    ConditionnelEntretien: [{ type: 'Bougie', quantite: 4 }],
  };

  constructor(private http: HttpClient) {}

  getEntretiens(vehiculeId: number): Observable<EntretienResponse[]> {
    return this.http.get<EntretienResponse[]>(`/api/vehicules/${vehiculeId}/entretiens`);
  }

  creerEntretien(vehiculeId: number, request: EntretienRequest): Observable<EntretienResponse> {
    return this.http.post<EntretienResponse>(`/api/vehicules/${vehiculeId}/entretiens`, request);
  }

  supprimerEntretien(id: number): Observable<void> {
    return this.http.delete<void>(`/api/entretiens/${id}`);
  }

  calculerCout(typeEntretien: string, produits: ProduitResponse[]): CoutEstime {
    const lignes = this.produitsParType[typeEntretien] || [];
    let total = 0;
    const detail: { produit: ProduitResponse; quantite: number }[] = [];

    for (const ligne of lignes) {
      const produit = produits.find((p) => p.typeProduit === ligne.type);
      if (produit) {
        const coutLigne = (produit.prix + produit.mainDOeuvre) * ligne.quantite;
        total += coutLigne;
        detail.push({ produit, quantite: ligne.quantite });
      }
    }

    return { total, detail };
  }
}
