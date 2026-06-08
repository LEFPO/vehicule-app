import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { VehiculeService, VehiculeResponse } from '../../services/vehicule';
import { EntretienService, EntretienResponse } from '../../services/entretien';
import { ErreurService } from '../../services/erreur';

@Component({
  selector: 'app-vehicule-detail',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTableModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDividerModule,
  ],
  templateUrl: './vehicule-detail.html',
  styleUrl: './vehicule-detail.css',
})
export class VehiculeDetailComponent implements OnInit {
  vehicule: VehiculeResponse | null = null;
  entretiens: EntretienResponse[] = [];
  colonnes = ['date', 'type', 'note', 'cout', 'actions'];
  afficherFormPartage = false;
  estProprietaire = false;

  emailControl = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehiculeService: VehiculeService,
    private entretienService: EntretienService,
    private snackBar: MatSnackBar,
    private erreurService: ErreurService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.vehiculeService.getVehicule(id).subscribe({
      next: (data) => {
        this.vehicule = data;
        this.estProprietaire = data.role === 'PROPRIETAIRE';
      },
      error: () => void this.router.navigate(['/dashboard']),
    });
    this.entretienService.getEntretiens(id).subscribe({
      next: (data) => (this.entretiens = data),
      error: (err) => console.error(err),
    });
  }

  retour() {
    void this.router.navigate(['/dashboard']);
  }

  supprimer() {
    if (confirm('Confirmer la suppression de ce véhicule ?')) {
      this.vehiculeService.supprimerVehicule(this.vehicule!.id).subscribe({
        next: () => void this.router.navigate(['/dashboard']),
        error: (err) => this.erreurService.gerer(err),
      });
    }
  }

  toggleFormPartage() {
    this.afficherFormPartage = !this.afficherFormPartage;
    if (!this.afficherFormPartage) {
      this.emailControl.reset();
    }
  }

  partager() {
    if (this.emailControl.invalid) return;
    const email = this.emailControl.value!;
    this.vehiculeService.partagerVehicule(this.vehicule!.id, email).subscribe({
      next: () => {
        this.snackBar.open(`Accès partagé avec ${email} !`, 'Fermer', { duration: 3000 });
        this.afficherFormPartage = false;
        this.emailControl.reset();
      },
      error: (err) => this.erreurService.gerer(err),
    });
  }

  supprimerEntretien(id: number) {
    if (confirm('Confirmer la suppression de cet entretien ?')) {
      this.entretienService.supprimerEntretien(id).subscribe({
        next: () => {
          this.entretiens = this.entretiens.filter((e) => e.id !== id);
          this.snackBar.open('Entretien supprimé', 'Fermer', { duration: 3000 });
        },
        error: (err) => this.erreurService.gerer(err),
      });
    }
  }
}
