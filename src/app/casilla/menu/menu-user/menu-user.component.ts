import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { DOBLE_PERFIL, LOGIN_TYPE, UserSession } from 'src/app/utiils/types';
import { AuthTokenService } from '../../service/auth-token.service';
import { AccountService } from 'src/app/service/account.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-user',
  standalone: true,
  imports: [
    CommonModule,
    AccordionModule,
  ],
  templateUrl: './menu-user.component.html',
  styleUrls: ['./menu-user.component.scss']
})
export class MenuUserComponent {

  @Input() alwaysExpanded: boolean = false

  esAbogado = false
  esDefensor = false
  userData: UserSession | null = null
  tipoPerfil = ''
  loginType = LOGIN_TYPE
  expanded: boolean = false
  svgPersonaNatural: string = 'assets/svg/natural.svg'
  svgAbogado: string = 'assets/svg/abogado.svg'
  svgDefensorPublico: string = 'assets/svg/defensor.svg'
  
  constructor(
    private tokenService: AuthTokenService,
    private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userData = this.tokenService.decoded;
    this.tipoPerfil = this.getTipoPerfil();
  
    if ( this.userData?.abogado === DOBLE_PERFIL.ABOGADO ) {
      this.esAbogado = true
    }
  
    if ( this.userData?.defensor === DOBLE_PERFIL.ABOGADO ) {
      this.esDefensor = true
    }

    this.expanded = this.alwaysExpanded
  }

  getTipoPerfil() {
    if ( this.userData?.session === this.loginType.PERSONA_NATURAL ) {
      return 'Persona Natural'
    }
    if ( this.userData?.session === this.loginType.ABOGADO ) {
      return 'Abogado'
    }
    if ( this.userData?.session === this.loginType.DEFENSOR_PUBLICO ) {
      return 'Defensor Público'
    }
    return 'N/A'
  }

  changeProfile(event: MouseEvent, s: string) {
    event.preventDefault();
    if (this.userData?.session == s) {
      return ;
    }
    this.accountService.changeProfile(s).subscribe(
      {
        next: (response) => {
          this.tokenService.saveToken(response?.token);
          this.router.navigate(['/app/inbox']).then(() => {            
            window.location.reload();
          });
        }, 
        error: (error: HttpErrorResponse) => {
        }
      }
    )

  }

  onClickTab() {
    if ( this.alwaysExpanded ) {
      this.expanded = true
    }
  }

}
