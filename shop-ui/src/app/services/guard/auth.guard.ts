import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {KeycloakService} from '../keycloak/keycloak.service';

// Checks if the user is authenticated and he has appropriate role
export const authGuard: (requiredRole: string) => CanActivateFn =
  (requiredRole: string): CanActivateFn => (): boolean => {
    const keycloakService: KeycloakService = inject(KeycloakService);
    const isReady: boolean = keycloakService.isAuthenticated();
    const hasRole: boolean = keycloakService.userRole === requiredRole;

    return isReady && hasRole;
  }
// FIXME DONE
