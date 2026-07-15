import {ApplicationRef, computed, Injectable, Signal} from '@angular/core';
import Keycloak, {KeycloakProfile} from 'keycloak-js';
import {Router} from '@angular/router';
import {first} from 'rxjs';
import {Role} from './role';
import {IS_BROWSER} from '../../common/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService { // FIXME DONE
  private _keycloak: Keycloak | undefined;
  private _userProfile: KeycloakProfile | null = null;
  private _tokenRefreshLoopIntervalId?: number;

  public readonly isAuthenticated: Signal<boolean> =
    computed((): boolean => !!this.keycloak.authenticated);

  constructor(
    private readonly _router: Router,
    private readonly _appRef: ApplicationRef
  ) {}

  private get keycloak(): Keycloak {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: 'http://localhost:9080',
        realm: 'e-shop',
        clientId: 'e-shop'
      });
    }
    return this._keycloak!;
  }

  public async init(): Promise<void> {
    if (!IS_BROWSER) return;

    try {
      const isAuthenticated: boolean = await this.keycloak.init({
        onLoad: 'check-sso', // Attempts silent authentication to detect existing login session without redirect
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html', // iframe used for silent SSO chek
        pkceMethod: 'S256',
        checkLoginIframe: true
      });

      if (isAuthenticated) {
        await this.loadUserProfile();

        this._appRef.isStable
          .pipe(
            first((stable: boolean): boolean => stable))
          .subscribe((): void => {
            const exp: number | undefined = this.keycloak.tokenParsed?.exp; // Token expiration time
            const iat: number | undefined = this.keycloak.tokenParsed?.iat; // Token issued at time

            if (exp !== undefined && iat !== undefined) {
              const accessTokenLifespan: number = (exp - iat) * 1000;
              this.tokenRefreshLoop(accessTokenLifespan);
            }
          });
      }

    } catch (error) {
      console.error('Keycloak initialization failed', error);
    } finally {
      // Don't redirect from Stripe URLs
      if (!window.location.href.includes('/success?session_id=')
        && !window.location.href.includes('/failure')) {
        await this._router.navigate([this.postLoginRoute]);
      }
    }
  }

  private get userRoles(): string[] {
    return this.keycloak.tokenParsed?.resource_access?.['e-shop']?.roles || [];
  }

  public get userRole(): Role {
    if (this.userRoles.includes('ADMIN')) {
      return 'ADMIN';
    } else if (this.userRoles.includes('USER')) {
      return 'USER';
    }
    return '';
  }

  private get postLoginRoute(): string {
    return this.userRole === 'ADMIN'
      ? 'admin/categories'
      : this.userRole === 'USER'
        ? 'user/products'
        : '';
  }

  public get userProfile(): KeycloakProfile | null {
    return this._userProfile;
  }

  public get token(): string | undefined {
    return this.keycloak.token;
  }

  private async loadUserProfile(): Promise<void> {
    this._userProfile = await this.keycloak.loadUserProfile();
  }

  private tokenRefreshLoop(accessTokenLifespan: number): void {
    this._tokenRefreshLoopIntervalId = window.setInterval((): void => {
      this.keycloak.updateToken(1)
        .catch((): void => {
          console.warn('Token refresh failed, logging out');
          this.logout();
        });
    }, accessTokenLifespan);
  }

  public login(): void {
    this.keycloak.login();
  }

  public register(): void {
    this.keycloak.register();
  }

  public logout(): void {
    if (this._tokenRefreshLoopIntervalId != undefined) {
      clearInterval(this._tokenRefreshLoopIntervalId);
      this._tokenRefreshLoopIntervalId = undefined;
    }

    this.keycloak.logout()
      .then((): void => {
        this._userProfile = null;
      });
  }

}
