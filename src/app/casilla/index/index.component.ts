import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthTokenService } from '../service/auth-token.service';
import { LOGIN_TYPE, SidebarMenuResponse, TIPO_PERSONA, UserSession } from 'src/app/utiils/types';
import { AccountService } from 'src/app/service/account.service';
import { CommonModule } from '@angular/common';
import { ProfileDetComponent } from '../partials/profile-det/profile-det.component';
import { MenuComponent } from '../menu/menu/menu.component';
import { RouterOutlet } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';


const enterTransition = transition(':enter', [
  style({
    opacity: 0,
    top: 'calc(100% + 15px)', position: 'absolute', right: 0
  }),
  animate('.2s ease-in', style({ opacity: 1, top: '100%', position: 'absolute', right: 0 })),
]);
const exitTransition = transition(':leave', [
  style({
    opacity: 1,
    top: '100%', position: 'absolute', right: 0
  }),
  animate('.2s ease-out', style({ opacity: 0, top: 'calc(100% + 15px)', position: 'absolute', right: 0 })),
]);
@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    CommonModule,
    ProfileDetComponent,
    MenuComponent,
    RouterOutlet,
    FooterComponent,
  ],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  animations: [trigger('fadeIn', [enterTransition]), trigger('fadeOut', [exitTransition])]
})
export class IndexComponent implements OnInit {

  toggleProfile = false
  openSide = true;
  tipoPerfil = '';
  appName: string = environment.APP_NAME
  logoImg: string = 'assets/images/logo3.png'
  logoImgReduced: string = 'assets/images/logo-reduced.png'
  sidebarCollapsed: boolean = false
  svgPersonaNatural: string = 'assets/svg/natural.svg'
  svgAbogado: string = 'assets/svg/abogado.svg'
  svgDefensorPublico: string = 'assets/svg/defensor.svg'

  menu$!: Observable<SidebarMenuResponse>;
  userData: UserSession | null = null;

  constructor(
    private tokenService: AuthTokenService,
    private accountService: AccountService,
  ) { 
    window.innerWidth <= 1060 && ( this.sidebarCollapsed = true )
  }

  ngOnInit(): void {
    this.menu$ = this.accountService.getMenu();
    this.userData = this.tokenService.decoded;
    this.tipoPerfil = this.getTipoPerfil();
  }

  toggleProfileDet(evt: MouseEvent) {
    evt.preventDefault();
    this.toggleProfile = !this.toggleProfile
  }

  openSidebar($event: MouseEvent) {
    $event.preventDefault();
    this.openSide = !this.openSide;

  }

  logout() {
    this.tokenService.logout()

  }

  /**
   * TODO: Analizar y refactorizar este método
   *  
   */
  getTipoPerfil() {
    if (this.userData?.tipo == TIPO_PERSONA.NATURAL && this.userData.session == LOGIN_TYPE.ABOGADO) {
      return 'Abogado'
    } else if (this.userData?.tipo == TIPO_PERSONA.NATURAL && this.userData?.session == LOGIN_TYPE.PERSONA_NATURAL) {
      return 'Persona Natural'
    } else if (this.userData?.tipo == TIPO_PERSONA.NATURAL && this.userData.session == LOGIN_TYPE.DEFENSOR_PUBLICO) {
      return 'Defensor Público'
    }
    else {
      return 'N/A'
    }
  }


}
