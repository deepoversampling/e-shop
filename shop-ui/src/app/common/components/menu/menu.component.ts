import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {ProfileFullnamePipe} from '../../pipes/profile-fullname/profile-fullname.pipe';
import {ProfileInitialPipe} from '../../pipes/profile-initial/profile-initial.pipe';
import {KeycloakService} from '../../../services/keycloak/keycloak.service';
import {KeycloakProfile} from 'keycloak-js';

@Component({
  selector: 'app-menu',
  imports: [
    RouterLink,
    RouterLinkActive,
    ProfileFullnamePipe,
    ProfileInitialPipe
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent { // FIXME DONE
  constructor(private readonly _keycloakService: KeycloakService) {}

  protected get isAuthenticated(): boolean {
    return this._keycloakService.isAuthenticated();
  }

  protected get userRole(): string {
    return this._keycloakService.userRole;
  }

  protected get userProfile(): KeycloakProfile | null {
    return this._keycloakService.userProfile;
  }

  protected login(): void {
    this._keycloakService.login();
  }

  protected register(): void {
    this._keycloakService.register();
  }

  protected logout(): void {
    this._keycloakService.logout();
  }

}
