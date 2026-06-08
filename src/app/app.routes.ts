import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { VehiculeDetailComponent } from './components/vehicule-detail/vehicule-detail';
import { authGuard } from './guards/auth-guard';
import { VehiculeFormComponent } from './components/vehicule-form/vehicule-form';
import { EntretienFormComponent } from './components/entretien-form/entretien-form';
import { RappelsComponent } from './components/rappels/rappels';
import { ProfilComponent } from './components/profil/profil';
import { ProduitsComponent } from './components/produits/produits';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'vehicules/new', component: VehiculeFormComponent, canActivate: [authGuard] },
  { path: 'vehicules/edit/:id', component: VehiculeFormComponent, canActivate: [authGuard] },
  { path: 'vehicules/:id', component: VehiculeDetailComponent, canActivate: [authGuard] },
  {
    path: 'entretiens/new/:vehiculeId',
    component: EntretienFormComponent,
    canActivate: [authGuard],
  },
  { path: 'rappels', component: RappelsComponent, canActivate: [authGuard] },
  { path: 'profil', component: ProfilComponent, canActivate: [authGuard] },
  { path: 'produits', component: ProduitsComponent, canActivate: [authGuard] },
];
