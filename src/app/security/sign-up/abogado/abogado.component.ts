import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { StepsModule } from 'primeng/steps';
import { Subscription, catchError, pipe, tap } from 'rxjs';
import { AlertService } from 'src/app/service/Alert.service';
import { ToastMessageService } from 'src/app/service/toast-message.service';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { RegresarComponent } from 'src/app/utiils/regresar/regresar.component';
import { APP_HEADER, DOBLE_PERFIL, PersonaNaturalAfiliacion } from 'src/app/utiils/types';
import { environment } from 'src/environments/environment';
import { AffiliationService } from '../../service/affiliation.service';
import { DtoService } from '../../service/dto.service';
import { ConfirmacionComponent } from '../persona-natural/confirmacion/confirmacion.component';
import { IdentificacionComponent } from '../persona-natural/identificacion/identificacion.component';
import { VerificacionComponent } from '../persona-natural/verificacion/verificacion.component';
import { Router } from '@angular/router';
import { handleErrorWithAlert, handleErrorWithToast } from 'src/app/utiils/funcs';
import { SessionStorageService } from '../../service/session-storage.service';

@Component({
  selector: 'app-abogado',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    StepsModule,
    VerificacionComponent,
    ConfirmacionComponent,
    IdentificacionComponent,
    RegresarComponent,
  ],
  templateUrl: './abogado.component.html',
  styleUrls: ['./abogado.component.scss'],
  providers: [MessageService, AlertService, DialogService, ToastMessageService]
})
export class AbogadoComponent implements OnInit, OnDestroy {


  TIPO_ABOGADO = DOBLE_PERFIL.ABOGADO;
  public appName: string = environment.APP_NAME
  public entityName: string = environment.ENTITY_NAME
  subs = new Subscription();

  activeIndex = 0;
  public steps = [
    {
      label: 'Identificación',
    },
    {
      label: 'Verificación',
    },
    {
      label: 'Confirmación',
    },

  ];

  constructor(private dtoService: DtoService,
    private afiliacionService: AffiliationService,
    private toast: ToastMessageService,
    private spiner: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private sessionStorageService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.afiliacionService.initAfiliacion().subscribe({
      next: (response) => {
        
        this.sessionStorageService.setItem(APP_HEADER.HEADER_X_TOKEN_AFIL, response);
        
      }
    })
    this.dtoService.clearPersonaNatural();
    if (!this.dtoService.itWasAccepted()) {
      this.router.navigate(['/']);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  changeStep(index: number) {
    this.activeIndex = index;
  }

  alVerificar(persona: PersonaNaturalAfiliacion) {
    this.spiner.show();
    this.subs.add(
      this.afiliacionService.identificacionAbogado(persona)
      .pipe(
        catchError((error: HttpErrorResponse) => handleErrorWithToast(error, this.toast)),
        tap(response => {
          this.sessionStorageService.setItem(APP_HEADER.HEADER_X_TOKEN_AFIL, response.headers.get(APP_HEADER.HEADER_X_TOKEN_AFIL));
        })
      ).subscribe(
        {
          next: (response) => {
            if (response.status == HttpStatusCode.Ok) {
              this.dtoService.patchPersonaNatural({...persona, ...response.body as Partial<PersonaNaturalAfiliacion>});
              this.changeStep(1);
            } else {
              this.toast.showWarn(response.body?.message!);
            }
            this.spiner.hide();
          },
          error: (error) => {
            this.spiner.hide();            
          }
        }
      )
    );
  }


  afiliar(persona: PersonaNaturalAfiliacion) {
    const datos = this.dtoService.getPersonaNatural();

    const ref = this.alertService.showWarning(`Aviso`, `Sr(a). <strong>${datos.nombres} ${datos.apellidoPaterno} ${datos.apellidoMaterno}</strong>, 
          usted se encuentra a punto de afiliarse a la ${ this.appName } del ${ this.entityName }. 
          Por favor, confirme si desea continuar con la afiliación para la notificación de trámites en calidad de abogado defensor.`,
      {
        confirm: true,
        confirmLabel: `Sí, continuar`,
        cancelLabel: `No, cancelar`
      }, '550px');

    ref.onClose.subscribe((ok) => {
      if (ok) {

        this.spiner.show();
        this.dtoService.patchPersonaNatural(persona);
        const tc = this.dtoService.itWasAccepted();
        this.subs.add(
          this.afiliacionService.afiliarAbogado({ ...this.dtoService.getPersonaNatural(), tc })
          .pipe(
            catchError((error: HttpErrorResponse) => handleErrorWithAlert(error, this.alertService))
          ).subscribe({
            next: (response) => {
              this.spiner.hide();
              this.changeStep(2);
            },
            error: (error: HttpErrorResponse) => {
              this.spiner.hide();              
            }
          })
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
