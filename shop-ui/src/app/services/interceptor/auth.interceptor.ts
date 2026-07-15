import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {KeycloakService} from '../keycloak/keycloak.service';
import {Observable} from 'rxjs';

export const authInterceptor: HttpInterceptorFn =
  (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const keycloakService: KeycloakService = inject(KeycloakService);
    const token: string | undefined = keycloakService.token;

    if (token) {
      const authReq: HttpRequest<unknown> = req.clone({
        headers: req.headers.append('Authorization', `Bearer ${token}`),
      });
      return next(authReq);
    }
    return next(req);
  };
// FIXME DONE
