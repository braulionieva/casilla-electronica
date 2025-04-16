import {CommonModule} from '@angular/common';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {RecaptchaComponent, RecaptchaFormsModule, RecaptchaModule} from 'ng-recaptcha';
import {NgxSpinnerService} from 'ngx-spinner';
import {MessageService} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {DialogService} from 'primeng/dynamicdialog';
import {InputTextModule} from 'primeng/inputtext';
import {ToastModule} from 'primeng/toast';
import {catchError, Subscription} from 'rxjs';
import {AffiliationService} from 'src/app/security/service/affiliation.service';
import {DtoService} from 'src/app/security/service/dto.service';
import {AlertService} from 'src/app/service/Alert.service';
import {AnalyticsService} from 'src/app/service/analytics.service';
import {ToastMessageService} from 'src/app/service/toast-message.service';
import {CustomToastComponent} from 'src/app/shared/components/custom-toast/custom-toast.component';
import {handleErrorWithToast, soloNumeros} from 'src/app/utiils/funcs';
import {PersonaNaturalAfiliacion} from 'src/app/utiils/types';
import {environment} from 'src/environments/environment';


@Component({
  selector: 'app-verificacion',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    CustomToastComponent
  ],
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.scss'],
  providers: [MessageService, DialogService, AlertService, ToastMessageService]
})
export class VerificacionComponent implements OnInit, OnDestroy {

  tokenOK = false;

  subs = new Subscription();

  datos: Partial<PersonaNaturalAfiliacion> = {};

  tokenStr = '';
  @ViewChild('captchaRef') captchaRef: RecaptchaComponent | undefined;

  @Output()
  alAfiliar = new EventEmitter<PersonaNaturalAfiliacion>();

  @Output()
  changeStep = new EventEmitter<number>();

  siteKey = environment.CAPTCHA_SITE_KEY;
  form = this.fb.nonNullable.group(
    {
      celular: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      correo: ['', [Validators.required, Validators.email]],
      codigoVerificacion: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],

    }
  );

  public mobileIcon: string = 'assets/svg/mobile.svg'
  public mailIcon: string = 'assets/svg/mail.svg'

  constructor(private fb: FormBuilder,
              private afiliacionService: AffiliationService,
              private alertService: AlertService,
              private spiner: NgxSpinnerService,
              private dtoService: DtoService,
              private analitycs: AnalyticsService,
              private toast: ToastMessageService) {
  }

  ngOnInit(): void {

    this.analitycs.trackEvent('registro_step2', null);

    this.datos = this.dtoService.getPersonaNatural();
    if (this.datos) {
      this.form.patchValue(this.datos);
    }
  }

  get mobileCharactersCount(): number {
    return this.form.get('celular')?.value?.length ?? 0;
  }

  cancelar() {
    this.changeStep.emit(0);
  }

  errored(e: any) {

    this.tokenStr = '';
    this.tokenOK = false;
  }

  resolved(e: any) {
    if (!e) {
      this.tokenOK = false;
      this.tokenStr = '';
      return;
    }
    this.tokenStr = e;
    this.tokenOK = true;

  }

  enviarCodigo() {
    this.spiner.show();
    const email = this.form.get('correo')?.value!;
    const celular = this.form.get('celular')?.value!;
    this.subs.add(
      this.afiliacionService.sendCode(email, celular, this.datos.numeroDocumento ?? '', this.tokenStr)
        .pipe(
          catchError((error: HttpErrorResponse) => handleErrorWithToast(error, this.toast))
        ).subscribe(
        {
          next: (response) => {

            if (HttpStatusCode.Ok == response.status) {
              this.alertService.showSuccess('Envío correcto', `El código de verificación fue enviado al correo electrónico
              proporcionado y caducará al cabo de <strong>5 minutos</strong>.`);

            } else {
              this.alertService.showWarning('Envío incorrecto', `Debe esperar <strong>5 minutos</strong> para enviar otro código.`);
            }

            this.spiner.hide();
          },
          error: (error: HttpErrorResponse) => {
            this.captchaRef?.reset();
            this.spiner.hide();
          }
        }
      )
    );

  }

  verificarDatos() {
    this.alAfiliar.emit(this.form.value as PersonaNaturalAfiliacion);
  }

  soloNumeros($event: any, controlName: string) {
    const input = $event.target;
    const numeros = soloNumeros(input.value ?? '');
    this.form.get(controlName)?.setValue(numeros, {emitEvent: false});
  }

  get disabledButton() {
    return !this.form.get('correo')?.valid || !this.tokenOK;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }


}
