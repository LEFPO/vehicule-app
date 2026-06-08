import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { EntretienService, CoutEstime } from '../../services/entretien';
import { ProduitService, ProduitResponse } from '../../services/produit';

@Component({
  selector: 'app-entretien-form',
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
    MatTableModule,
    MatDividerModule,
  ],
  templateUrl: './entretien-form.html',
  styleUrl: './entretien-form.css',
})
export class EntretienFormComponent implements OnInit {
  form: FormGroup;
  erreur = '';
  chargement = false;
  vehiculeId!: number;
  produits: ProduitResponse[] = [];
  coutEstime: CoutEstime | null = null;
  colonnes = ['produit', 'quantite', 'prix', 'mainDOeuvre', 'total'];

  typesEntretien = [
    'PetitEntretien',
    'GrandEntretien',
    'PreventionEntretien',
    'ConditionnelEntretien',
  ];

  constructor(
    private fb: FormBuilder,
    private entretienService: EntretienService,
    private produitService: ProduitService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.form = this.fb.group({
      typeEntretien: ['', Validators.required],
      date: ['', Validators.required],
      note: [''],
      cout: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.vehiculeId = Number(this.route.snapshot.paramMap.get('vehiculeId'));
    this.produitService.getProduits().subscribe({
      next: (data) => (this.produits = data),
    });

    this.form.get('typeEntretien')?.valueChanges.subscribe((type) => {
      if (type) {
        this.coutEstime = this.entretienService.calculerCout(type, this.produits);
        this.form.patchValue({ cout: this.coutEstime.total }, { emitEvent: false });
      }
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.chargement = true;
    this.erreur = '';

    this.entretienService.creerEntretien(this.vehiculeId, this.form.value).subscribe({
      next: () => this.router.navigate(['/vehicules', this.vehiculeId]),
      error: () => {
        this.erreur = "Erreur lors de la création de l'entretien";
        this.chargement = false;
      },
    });
  }
}
