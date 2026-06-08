import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { VehiculeService, VehiculeResponse } from '../../services/vehicule';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  vehicules: VehiculeResponse[] = [];
  nom = '';

  constructor(
    private vehiculeService: VehiculeService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.nom = this.authService.getNom();
    this.chargerVehicules();
  }

  chargerVehicules() {
    this.vehiculeService.getMesVehicules().subscribe({
      next: (data) => (this.vehicules = data),
      error: (err) => console.error(err),
    });
  }

  voirDetail(id: number) {
    void this.router.navigate(['/vehicules', id]);
  }

  logout() {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
