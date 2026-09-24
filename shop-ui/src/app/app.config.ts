import {ApplicationConfig, inject, provideAppInitializer} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './services/interceptor/auth.interceptor';
import {KeycloakService} from './services/keycloak/keycloak.service';
import {ResourcesInitService} from './services/resources-init/resources-init.service';
import {provideToastr} from 'ngx-toastr';
import {provideAnimations, provideNoopAnimations} from '@angular/platform-browser/animations';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {ROOT_URL} from './tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(
      withEventReplay()
    ),
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withFetch()
    ),
    provideAnimationsAsync(),
    provideNoopAnimations(),
    provideToastr({
      progressBar: true,
      closeButton: true,
      newestOnTop: true,
      tapToDismiss: true,
      positionClass: 'toast-bottom-right',
      timeOut: 8000
    }),
    provideAppInitializer((): Promise<void> => inject(KeycloakService).init()),
    provideAppInitializer((): Promise<void> => inject(ResourcesInitService).init()),
    provideAnimations(),
    {
      provide: ROOT_URL,
      // The value is set using function that reads the property in the window (useValue causes window is not defined)
      // __ROOT_URL__ is set in the window before the application is bootstrapped
      useFactory: (): any => (window as any).__ROOT_URL__
    }
  ]
};
