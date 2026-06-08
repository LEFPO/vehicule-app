import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ErreurService {
  constructor(private snackBar: MatSnackBar) {}

  gerer(erreur: HttpErrorResponse): void {
    const message = this.extraireMessage(erreur);
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['snackbar-erreur'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  private extraireMessage(erreur: HttpErrorResponse): string {
    // Message du backend
    if (erreur.error?.message) {
      return erreur.error.message;
    }

    // Messages par code HTTP
    switch (erreur.status) {
      case 400:
        return 'Données invalides — vérifiez les champs du formulaire';
      case 401:
        return 'Session expirée — veuillez vous reconnecter';
      case 403:
        return 'Action non autorisée';
      case 404:
        return 'Ressource introuvable';
      case 409:
        return 'Conflit — cette ressource existe déjà';
      case 0:
        return 'Impossible de contacter le serveur — vérifiez votre connexion';
      default:
        return 'Une erreur inattendue est survenue';
    }
  }
}
