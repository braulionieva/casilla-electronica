import { Routes } from '@angular/router';
import { NoEncontradoComponent } from '../no-encontrado/no-encontrado.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AbogadoComponent } from './sign-up/abogado/abogado.component';
import { PersonaNaturalComponent } from './sign-up/persona-natural/persona-natural.component';
import { SelectProfileComponent } from './sign-up/select-profile/select-profile.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ValidarCodigoComponent } from './validar-codigo/validar-codigo.component';

export const routes: Routes = [
  {
    path: '', component: SignInComponent,
    pathMatch: 'full'
  },
  { path: 'login', component: SignInComponent },
  {
    path: 'sign-up', children: [
      { path: '', component: SignUpComponent },
      { path: 'persona-natural', component: PersonaNaturalComponent },
      { path: 'abogado', component: AbogadoComponent },
      { path: 'recuperar-cuenta', component: ValidarCodigoComponent }
    ]
  },
  { path: 'profile', component: SelectProfileComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'no-encontrado', component: NoEncontradoComponent, data: { redirect: '', className: 'no_encontrado__external' } }

];

