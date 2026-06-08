import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profil',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSnackBarModule,
  ],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class ProfilComponent implements OnInit {
  form: FormGroup;
  erreur = '';
  chargement = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.form.patchValue({
      nom: this.authService.getNom(),
      email: this.authService.getEmail(),
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.chargement = true;
    this.erreur = '';

    this.http.put('/api/auth/me', this.form.value).subscribe({
      next: (response: any) => {
        localStorage.setItem('nom', response.nom);
        localStorage.setItem('email', response.email);
        this.snackBar.open('Profil mis à jour !', 'Fermer', { duration: 3000 });
        this.chargement = false;
      },
      error: () => {
        this.erreur = 'Erreur lors de la mise à jour';
        this.chargement = false;
      },
    });
  }

  logout() {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
