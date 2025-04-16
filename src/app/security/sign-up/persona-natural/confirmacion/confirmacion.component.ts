import { Component, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DtoService } from 'src/app/security/service/dto.service';
import { PersonaNaturalAfiliacion } from 'src/app/utiils/types';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AnalyticsService } from 'src/app/service/analytics.service';

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule
  ],
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.scss']
})
export class ConfirmacionComponent implements OnInit {

  datos: Partial<PersonaNaturalAfiliacion> = {};

  linkCasilla: string = environment.HTTP_CASILLA_WEB

  fechaAfiliacion = new Date();
  @Input() personaAfiliada = 'Persona Natural';

  public logoImage: string = 'assets/images/logo3.png'
  public appName: string = environment.APP_NAME

  constructor(private dtoService: DtoService,
    private analitycs: AnalyticsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.analitycs.trackEvent('registro_step3', null);
    this.datos = this.dtoService.getPersonaNatural();
  }

  print() { window.print() }
  refresh() { 
    this.router.navigate(['security','login'])
   }
}
