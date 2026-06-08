import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VehiculeService } from '../../services/vehicule';
import { NhtsaService } from '../../services/nhtsa';
import { ErreurService } from '../../services/erreur';

@Component({
  selector: 'app-vehicule-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './vehicule-form.html',
  styleUrl: './vehicule-form.css',
})
export class VehiculeFormComponent implements OnInit {
  form: FormGroup;
  erreur = '';
  chargement = false;
  vehiculeId: number | null = null;
  modeEdition = false;

  marques: string[] = [];
  modeles: string[] = [];
  chargementMarques = false;
  chargementModeles = false;

  carburants = ['Diesel', 'Essence', 'Hybride', 'Electrique', 'LPG', 'Ethanol'];
  typesVehicule = ['Berlines', 'Citadines', 'SUV', 'Breaks', 'Coupes', 'Cabriolets', 'Monospace'];

  constructor(
    private fb: FormBuilder,
    private vehiculeService: VehiculeService,
    private nhtsaService: NhtsaService,
    private router: Router,
    private route: ActivatedRoute,
    private erreurService: ErreurService,
  ) {
    this.form = this.fb.group({
      marque: ['', Validators.required],
      modele: ['', Validators.required],
      annee: ['', Validators.required],
      kilometrage: ['', [Validators.required, Validators.min(0)]],
      carburant: ['', Validators.required],
      typeVehicule: ['', Validators.required],
      immatriculation: ['', [Validators.required, Validators.maxLength(9)]],
      attributsSpecifique: [''],
    });
  }

  ngOnInit() {
    // Désactiver le champ modèle au départ
    this.form.get('modele')?.disable();

    this.chargementMarques = true;
    this.nhtsaService.getMarques().subscribe({
      next: (data) => {
        this.marques = data;
        this.chargementMarques = false;
      },
      error: () => (this.chargementMarques = false),
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vehiculeId = Number(id);
      this.modeEdition = true;
      this.vehiculeService.getVehicule(this.vehiculeId).subscribe({
        next: (v) => {
          this.form.patchValue(v);
          if (v.marque) {
            this.chargerModeles(v.marque);
          }
        },
        error: () => void this.router.navigate(['/dashboard']),
      });
    }

    // Écouter les changements de marque
    this.form.get('marque')?.valueChanges.subscribe((marque) => {
      if (marque) {
        this.form.get('modele')?.disable();
        this.form.patchValue({ modele: '' }, { emitEvent: false });
        this.chargerModeles(marque);
      }
    });
  }

  chargerModeles(marque: string) {
    this.chargementModeles = true;
    this.modeles = [];
    this.nhtsaService.getModeles(marque).subscribe({
      next: (data) => {
        this.modeles = data;
        this.chargementModeles = false;
        // Activer le champ modèle une fois les modèles chargés
        this.form.get('modele')?.enable();
      },
      error: () => {
        this.chargementModeles = false;
        this.form.get('modele')?.enable();
      },
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.chargement = true;

    if (this.modeEdition && this.vehiculeId) {
      this.vehiculeService.modifierVehicule(this.vehiculeId, this.form.value).subscribe({
        next: () => void this.router.navigate(['/vehicules', this.vehiculeId]),
        error: (err) => {
          this.erreurService.gerer(err);
          this.chargement = false;
        },
      });
    } else {
      this.vehiculeService.creerVehicule(this.form.value).subscribe({
        next: () => void this.router.navigate(['/dashboard']),
        error: (err) => {
          this.erreurService.gerer(err);
          this.chargement = false;
        },
      });
    }
  }
}
