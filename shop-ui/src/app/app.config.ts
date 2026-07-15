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

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withFetch()
    ),
    provideAppInitializer((): Promise<void> => inject(KeycloakService).init()),
    provideAppInitializer((): Promise<void> => inject(ResourcesInitService).init()),
    provideAnimations(),
    provideAnimationsAsync(),
    provideNoopAnimations(),
    provideToastr({
      progressBar: true,
      closeButton: true,
      newestOnTop: true,
      tapToDismiss: true,
      positionClass: 'toast-bottom-right',
      timeOut: 8000
    })
  ]
};
