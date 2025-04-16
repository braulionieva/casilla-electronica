import { CanActivateFn, Router } from '@angular/router';
import { inject } from "@angular/core";

export const notificationInboxGuard: CanActivateFn = (route, state) => {

  const type = route.paramMap.get('type');
  const id = route.paramMap.get('id');

  const CARPETAS = ['folder','tag']
  const IDS = ['0','2','3','4','5','N','C']

  if (!(CARPETAS.includes(type as string) && IDS.includes(id as string))) {
    return inject(Router).createUrlTree(['app/no-encontrado']);
  } 

  route.data = { type, id };

  return true;
};
