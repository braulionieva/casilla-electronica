import { CanActivateFn, Router } from '@angular/router';
import { AuthTokenService } from './auth-token.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const authToken = inject(AuthTokenService);
  const router = inject(Router)

  if (authToken.isLoggedIn())
    return true;

    
  router.navigateByUrl('/security/login');
  return false;
};
