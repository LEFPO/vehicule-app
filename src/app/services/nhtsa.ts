import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError } from 'rxjs';

export interface NhtsaModele {
  Model_ID: number;
  Model_Name: string;
}

const MODELES_EUROPEENS: { [marque: string]: string[] } = {
  Renault: [
    'Clio',
    'Megane',
    'Scenic',
    'Captur',
    'Kadjar',
    'Koleos',
    'Talisman',
    'Laguna',
    'Twingo',
    'Zoe',
    'Kangoo',
    'Master',
    'Trafic',
    'Arkana',
    'Austral',
    'Espace',
  ],
  Peugeot: [
    '108',
    '208',
    '308',
    '408',
    '508',
    '2008',
    '3008',
    '5008',
    'Partner',
    'Rifter',
    'Traveller',
    'Expert',
    'Boxer',
  ],
  Citroen: [
    'C1',
    'C3',
    'C4',
    'C5',
    'C3 Aircross',
    'C5 Aircross',
    'Berlingo',
    'SpaceTourer',
    'Jumpy',
    'Jumper',
  ],
  Dacia: ['Sandero', 'Logan', 'Duster', 'Jogger', 'Spring', 'Lodgy', 'Dokker'],
  Opel: [
    'Corsa',
    'Astra',
    'Insignia',
    'Mokka',
    'Crossland',
    'Grandland',
    'Zafira',
    'Combo',
    'Vivaro',
    'Movano',
  ],
  Seat: ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco', 'Alhambra', 'Toledo', 'Mii'],
  Skoda: ['Fabia', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq', 'Scala', 'Enyaq'],
  'Alfa Romeo': ['Giulia', 'Stelvio', 'Tonale', 'Giulietta', 'MiTo', '147', '156', '159'],
  Fiat: ['500', 'Panda', 'Tipo', 'Punto', '500X', '500L', 'Doblo', 'Ducato'],
  Abarth: ['500', '595', '695', 'Punto'],
  Maserati: ['Ghibli', 'Quattroporte', 'Levante', 'Grecale', 'GranTurismo'],
  Ferrari: ['Roma', 'Portofino', 'SF90', '296', 'F8', '812'],
  Lamborghini: ['Huracan', 'Urus', 'Revuelto'],
  Smart: ['ForTwo', 'ForFour', '#1', '#3'],
};

const MARQUES_AMERICAINES = [
  'Audi',
  'BMW',
  'Chevrolet',
  'Chrysler',
  'Dodge',
  'Ford',
  'Honda',
  'Hyundai',
  'Jaguar',
  'Jeep',
  'Kia',
  'Land Rover',
  'Lexus',
  'Mazda',
  'Mercedes-Benz',
  'Mini',
  'Mitsubishi',
  'Nissan',
  'Porsche',
  'Subaru',
  'Suzuki',
  'Tesla',
  'Toyota',
  'Volkswagen',
  'Volvo',
];

@Injectable({
  providedIn: 'root',
})
export class NhtsaService {
  private nhtsaUrl = 'https://vpic.nhtsa.dot.gov/api/vehicles';
  private cacheModeles: { [marque: string]: string[] } = {};

  private marques = [
    'Abarth',
    'Alfa Romeo',
    'Audi',
    'BMW',
    'Chevrolet',
    'Chrysler',
    'Citroen',
    'Dacia',
    'Dodge',
    'Ferrari',
    'Fiat',
    'Ford',
    'Honda',
    'Hyundai',
    'Jaguar',
    'Jeep',
    'Kia',
    'Lamborghini',
    'Land Rover',
    'Lexus',
    'Maserati',
    'Mazda',
    'Mercedes-Benz',
    'Mini',
    'Mitsubishi',
    'Nissan',
    'Opel',
    'Peugeot',
    'Porsche',
    'Renault',
    'Seat',
    'Skoda',
    'Smart',
    'Subaru',
    'Suzuki',
    'Tesla',
    'Toyota',
    'Volkswagen',
    'Volvo',
  ];

  constructor(private http: HttpClient) {}

  getMarques(): Observable<string[]> {
    return of(this.marques.sort());
  }

  getModeles(marque: string): Observable<string[]> {
    if (this.cacheModeles[marque]) {
      return of(this.cacheModeles[marque]);
    }

    // Marques européennes → liste manuelle
    if (MODELES_EUROPEENS[marque]) {
      const modeles = MODELES_EUROPEENS[marque].sort();
      this.cacheModeles[marque] = modeles;
      return of(modeles);
    }

    // Marques américaines → NHTSA
    if (MARQUES_AMERICAINES.includes(marque)) {
      return this.getModelesFallbackNhtsa(marque);
    }

    return of([]);
  }

  private getModelesFallbackNhtsa(marque: string): Observable<string[]> {
    return this.http
      .get<{
        Results: NhtsaModele[];
      }>(`${this.nhtsaUrl}/getmodelsformake/${encodeURIComponent(marque)}?format=json`)
      .pipe(
        map((response) => {
          const modeles = response.Results.map((m) => m.Model_Name).sort();
          this.cacheModeles[marque] = modeles;
          return modeles;
        }),
        catchError(() => of([])),
      );
  }
}
