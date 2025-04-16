import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthTokenService } from '../casilla/service/auth-token.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authToken = inject(AuthTokenService);
  const router = inject(Router)

  if (!authToken.isLoggedIn())
    return true;    
  router.navigateByUrl('/app');
  return false;
};
