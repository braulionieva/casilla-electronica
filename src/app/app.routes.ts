import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { noAuthGuard } from './service/no-auth.guard';
import { authGuard } from './casilla/service/auth.guard';

export const routes: Routes = [
    { path: '', component: LandingComponent,},
    {
      path: 'security',
      loadChildren: () => import('./security/security-routing')
        .then(m => m.routes), canActivate: [noAuthGuard]
    },
    {
      path: 'app',
      loadChildren: () => import('./casilla/casilla-routing')
        .then(m => m.routes), canActivate: [authGuard]
    },
    { path: '**', redirectTo: 'security/no-encontrado' }
    
  ];