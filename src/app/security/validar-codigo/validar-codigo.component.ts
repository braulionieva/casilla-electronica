import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {RecaptchaComponent, RecaptchaFormsModule, RecaptchaModule} from 'ng-recaptcha';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { catchError } from 'rxjs';
import { AlertService } from 'src/app/service/Alert.service';
import { ToastMessageService } from 'src/app/service/toast-message.service';
import { CustomToastComponent } from 'src/app/shared/components/custom-toast/custom-toast.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { SubheaderComponent } from 'src/app/shared/components/subheader/subheader.component';
import { handleErrorWithToast } from 'src/app/utiils/funcs';
import { RegresarComponent } from 'src/app/utiils/regresar/regresar.component';
import { environment } from 'src/environments/environment';
import { SecurityService } from '../service/security.service';
import { AfiliacionBoxComponent } from '../sign-in/afiliacion-box/afiliacion-box.component';

@Component({
  selector: 'app-validar-codigo',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    AfiliacionBoxComponent,
    RecaptchaModule,
    RecaptchaFormsModule,
    FooterComponent,
    HeaderComponent,
    SubheaderComponent,
    ToastModule,
    RegresarComponent,
    CustomToastComponent
  ],
  templateUrl: './validar-codigo.component.html',
  styleUrls: ['./validar-codigo.component.scss'],
  providers: [DialogService, MessageService, AlertService, ToastMessageService]
})
export class ValidarCodigoComponent implements OnInit {

  tokenOK = false;
  siteKey = environment.CAPTCHA_SITE_KEY;
  validando = false;

  token = '';

  @ViewChild('captchaRef') captchaRef: RecaptchaComponent | undefined;

  form = this.fb.group({
    usuario: ['', [Validators.required, Validators.minLength(8)]],
    token: ['', [Validators.required]],
  })

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly securityService: SecurityService,
    private readonly alertService: AlertService,
    private readonly toast: ToastMessageService,
    private readonly spiner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    /** Empty  */
  }

  goToLogin() {
    this.router.navigate(['/security']);
  }

  resolved(e: any) {
    if (!e) {
      this.tokenOK = false;
      this.form.get('token')?.setValue(null);
      return;
    }
    this.form.get('token')?.setValue(e);
    this.tokenOK = true;

  }

  errored(e: any) {
      /** Empty  */
      this.tokenOK = false;
      this.form.get('token')?.setValue(null);
  }

  enviar() {
    this.spiner.show();
    this.validando = true;
    if (this.form.value.usuario === 'xxxxxxxx') {

      this.validando = false;
      this.spiner.hide();
      const ref1 = this.alertService.showError('', `Cuenta Bloquada.`);

      ref1.onClose.subscribe(() => {
        this.router.navigate(['/security']);
      })
    }else{


    const token = this.form.value.token!;
    this.securityService.forgorPassword(this.form.value.usuario!, token)
      .pipe(
        catchError((error: HttpErrorResponse) => handleErrorWithToast(error, this.toast))
      ).subscribe(
      {
        next: (response) => {
          this.validando = false;
          this.spiner.hide();

          console.log('el valor es' + response.code);

          if (response.success && Number(response.code) !==2) {


            const ref = this.alertService.showSuccess('Éxito', `Se ha enviado un código de verificación de 6 digitos a su correo electrónico registrado. Por favor, revise su correo ${response.message} e ingrese el código para continuar con la recuperación de su cuenta. El código tiene una validez de 5 minutos`);

            ref.onClose.subscribe(() => {

              const ref1 = this.alertService.showSuccess('Éxito', `Se acaba de enviar un enlace a su correo electrónico para cambiar su contraseña. Por favor revise su correo ${response.message}.`);

              ref1.onClose.subscribe(() => {
                this.router.navigate(['/security']);
              })

            })

          }else if(response.success && Number(response.code) ===2){

            const ref1 = this.alertService.showError('', `Cuenta Bloqueada`);

            ref1.onClose.subscribe(() => {
              this.router.navigate(['/security']);
            })
          }

        },
        error: (error: HttpErrorResponse) => {
          this.captchaRef?.reset();
          this.spiner.hide();
          this.validando = false;

        }
      }
    )
      }
  }

}
