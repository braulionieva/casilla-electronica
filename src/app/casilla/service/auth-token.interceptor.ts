import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthTokenService } from './auth-token.service';
import { inject } from '@angular/core';
import { EMPTY, catchError, delay, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {

  const authToken = inject(AuthTokenService);
  const router = inject(Router);
  if (!req.url.includes('/auth/') && !req.url.includes('api64.ipify') && authToken.token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken.token}`
      }
    });
  }

  return next(req)
    .pipe(catchError((er: HttpErrorResponse) => {
      if (er.status == 401 || er.status == 403 || er.status == 0) {

        if (authToken.token && (!req.url.includes('login') && !req.url.includes('logout'))) {
          authToken.cleanClientTokenAndReload();
          /** Stop making requests to the server before reloading the page */
          return EMPTY.pipe(delay(1000))
        }
      }
      return throwError(() => er)
    }));
};
