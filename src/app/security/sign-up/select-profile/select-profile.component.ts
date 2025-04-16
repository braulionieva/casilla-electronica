import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { SubheaderComponent } from 'src/app/shared/components/subheader/subheader.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { environment } from 'src/environments/environment';
import { DtoService } from '../../service/dto.service';
import { RegresarComponent } from 'src/app/utiils/regresar/regresar.component';

@Component({
  selector: 'app-select-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    SubheaderComponent,
    FooterComponent,
    RegresarComponent
  ],
  templateUrl: './select-profile.component.html',
  styleUrls: ['./select-profile.component.scss']
})
export class SelectProfileComponent {

  public appName: string = environment.APP_NAME

  public profiles = [
    {
      name: 'Persona natural',
      image: 'assets/images/natural-juridica.png',
      url: ['/security/sign-up/persona-natural'],
      disabled: false,
    },
    {
      name: 'Abogado',
      image: 'assets/images/abogado.png',
      url: ['/security/sign-up/abogado'],
      disabled: false,
    }
  ];

  constructor(
    private router: Router,
    private dtoService: DtoService
  ) {

  }

  ngOnInit(): void {
    if (!this.dtoService.itWasAccepted()) {
      this.router.navigate(['/']);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
}
