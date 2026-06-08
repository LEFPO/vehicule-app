import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { RappelService, RappelResponse } from '../../services/rappel';
import { VehiculeService, VehiculeResponse } from '../../services/vehicule';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-rappels',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatTableModule,
    MatMenuModule,
  ],
  templateUrl: './rappels.html',
  styleUrl: './rappels.css',
})
export class RappelsComponent implements OnInit {
  alertes: RappelResponse[] = [];
  rappels: RappelResponse[] = [];
  vehicules: VehiculeResponse[] = [];
  erreur = '';
  chargement = false;
  colonnes = ['vehicule', 'type', 'date', 'kilometrage', 'actions'];

  form: FormGroup;

  typesRappel = ['EnAttente', 'Declenche', 'Traiter'];

  constructor(
    private rappelService: RappelService,
    private vehiculeService: VehiculeService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      vehiculeId: ['', Validators.required],
      typeRappel: ['EnAttente', Validators.required],
      dateRappel: [''],
      kilometrage: [''],
    });
  }

  ngOnInit() {
    this.chargerVehicules();
    this.chargerAlertes();
  }

  chargerVehicules() {
    this.vehiculeService.getMesVehicules().subscribe({
      next: (data) => {
        this.vehicules = data;
        if (data.length > 0) {
          this.chargerRappels(data[0].id);
        }
      },
    });
  }

  chargerAlertes() {
    this.rappelService.getAlertes().subscribe({
      next: (data) => (this.alertes = data),
      error: (err) => console.error(err),
    });
  }

  chargerRappels(vehiculeId: number) {
    this.rappelService.getRappels(vehiculeId).subscribe({
      next: (data) => (this.rappels = data),
      error: (err) => console.error(err),
    });
  }

  getVehiculeNom(vehiculeId: number): string {
    const v = this.vehicules.find((v) => v.id === vehiculeId);
    return v ? `${v.marque} ${v.modele}` : '';
  }

  supprimerRappel(id: number) {
    this.rappelService.supprimerRappel(id).subscribe({
      next: () => {
        this.rappels = this.rappels.filter((r) => r.id !== id);
        this.alertes = this.alertes.filter((r) => r.id !== id);
      },
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.chargement = true;
    this.erreur = '';

    const { vehiculeId, ...rappelData } = this.form.value;

    this.rappelService.creerRappel(vehiculeId, rappelData).subscribe({
      next: () => {
        this.chargerRappels(vehiculeId);
        this.chargerAlertes();
        this.form.reset({ typeRappel: 'EnAttente' });
        this.chargement = false;
      },
      error: () => {
        this.erreur = 'Erreur lors de la création du rappel';
        this.chargement = false;
      },
    });
  }

  changerStatut(rappel: RappelResponse, nouveauStatut: string) {
    this.rappelService.modifierStatut(rappel.id, nouveauStatut).subscribe({
      next: (updated) => {
        const index = this.rappels.findIndex((r) => r.id === rappel.id);
        if (index !== -1) this.rappels[index] = updated;
        this.chargerAlertes();
      },
      error: (err) => console.error(err),
    });
  }
}
