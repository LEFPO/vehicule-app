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
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ProduitService, ProduitResponse } from '../../services/produit';

@Component({
  selector: 'app-produits',
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
    MatTableModule,
    MatSnackBarModule,
  ],
  templateUrl: './produits.html',
  styleUrl: './produits.css',
})
export class ProduitsComponent implements OnInit {
  produits: ProduitResponse[] = [];
  produitSelectionne: ProduitResponse | null = null;
  colonnes = ['nom', 'type', 'prix', 'mainDOeuvre', 'actions'];
  erreur = '';
  chargement = false;
  modeEdition = false;

  typesProduit = [
    'HuileMoteur',
    'LiquideFrein',
    'LiquideRefroidissement',
    'PlaquetteFrein',
    'DisqueFrein',
    'FiltreHuile',
    'Batterie',
    'Bougie',
  ];

  form: FormGroup;

  constructor(
    private produitService: ProduitService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      prix: ['', [Validators.required, Validators.min(0)]],
      mainDOeuvre: ['', [Validators.required, Validators.min(0)]],
      typeProduit: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.chargerProduits();
  }

  chargerProduits() {
    this.produitService.getProduits().subscribe({
      next: (data) => (this.produits = data),
      error: (err) => console.error(err),
    });
  }

  selectionnerProduit(produit: ProduitResponse) {
    this.produitSelectionne = produit;
    this.modeEdition = true;
    this.form.patchValue(produit);
  }

  annuler() {
    this.modeEdition = false;
    this.produitSelectionne = null;
    this.form.reset();
  }

  submit() {
    if (this.form.invalid) return;
    this.chargement = true;
    this.erreur = '';

    if (this.modeEdition && this.produitSelectionne) {
      this.produitService.modifierProduit(this.produitSelectionne.id, this.form.value).subscribe({
        next: (updated) => {
          const index = this.produits.findIndex((p) => p.id === this.produitSelectionne!.id);
          if (index !== -1) this.produits[index] = updated;
          this.snackBar.open('Produit modifié !', 'Fermer', { duration: 3000 });
          this.annuler();
          this.chargement = false;
        },
        error: () => {
          this.erreur = 'Erreur lors de la modification';
          this.chargement = false;
        },
      });
    } else {
      this.produitService.creerProduit(this.form.value).subscribe({
        next: (nouveau) => {
          this.produits = [...this.produits, nouveau];
          this.snackBar.open('Produit créé !', 'Fermer', { duration: 3000 });
          this.form.reset();
          this.chargement = false;
        },
        error: () => {
          this.erreur = 'Erreur lors de la création';
          this.chargement = false;
        },
      });
    }
  }
}
