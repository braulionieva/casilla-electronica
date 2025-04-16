import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { AlertService } from 'src/app/service/Alert.service';
import { ToastMessageService } from 'src/app/service/toast-message.service';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { APP_HEADER, PersonaNaturalAfiliacion } from 'src/app/utiils/types';
import { AffiliationService } from '../../service/affiliation.service';
import { DtoService } from '../../service/dto.service';
import { ConfirmacionComponent } from './confirmacion/confirmacion.component';
import { IdentificacionComponent } from './identificacion/identificacion.component';
import { VerificacionComponent } from './verificacion/verificacion.component';
import { Subscription, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegresarComponent } from 'src/app/utiils/regresar/regresar.component';
import { Router } from '@angular/router';
import { handleErrorWithAlert, handleErrorWithToast } from 'src/app/utiils/funcs';
import { SessionStorageService } from '../../service/session-storage.service';


@Component({
  selector: 'app-persona-natural',
  standalone: true,
  imports: [
    CommonModule,
    StepsModule,
    HeaderComponent,
    FooterComponent,
    IdentificacionComponent,
    VerificacionComponent,
    ConfirmacionComponent,
    ToastModule,
    RegresarComponent
  ],
  templateUrl: './persona-natural.component.html',
  styleUrls: ['./persona-natural.component.scss'],
  providers: [MessageService, AlertService, DialogService, ToastMessageService]
})
export class PersonaNaturalComponent implements OnInit, OnDestroy {

  constructor(
    private dtoService: DtoService,
    private afiliacionService: AffiliationService,
    private toast: ToastMessageService,
    private spiner: NgxSpinnerService,
    private alertService: AlertService,
    private sessionStorageService: SessionStorageService,
    private router: Router
  ) { }

  activeIndex = 0;
  subs = new Subscription();
  public appName: string = environment.APP_NAME;
  public entityName: string = environment.ENTITY_NAME;

  actualizarCaptcha = false;

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

  ngOnInit(): void {
    this.afiliacionService.initAfiliacion().subscribe({
      next: (response) => {
        this.sessionStorageService.setItem(APP_HEADER.HEADER_X_TOKEN_AFIL, response);

      }
    })
    if (!this.dtoService.itWasAccepted()) {
        this.router.navigate(['/'], {});
    }
    this.dtoService.clearPersonaNatural();
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }



  changeStep(index: number) {
    this.activeIndex = index;
  }

  alVerificar(persona: PersonaNaturalAfiliacion) {
    this.spiner.show();
    this.actualizarCaptcha = false;
    this.subs.add(
      this.afiliacionService.validate(persona).pipe(
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
            this.actualizarCaptcha = true;
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
          Por favor, confirme si desea continuar con la afiliación para la notificación de trámites relacionados a
          sus procesos penales.`,
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
          this.afiliacionService.validateCode({ ...this.dtoService.getPersonaNatural(), tc })
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
        )


      }
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
