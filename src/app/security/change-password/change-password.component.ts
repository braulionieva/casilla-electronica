import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AbstractControlOptions, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { SecurityService } from '../service/security.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { matchValidator } from 'src/app/utiils/validator/match.validator';
import { AlertService } from 'src/app/service/Alert.service';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { SubheaderComponent } from 'src/app/shared/components/subheader/subheader.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { passwordValidator } from 'src/app/utiils/validator/password.validator';
import { PasswordPolicyComponent } from 'src/app/shared/password-policy/password-policy.component';
import { RegresarComponent } from 'src/app/utiils/regresar/regresar.component';
import { PasswordCryptService } from '../service/password-crypt.service';
import {
  SecurityResponsePolicyComponent
} from "../../shared/security-response-policy/security-response-policy.component";
import {ValidationType,validationOptions} from "../../utiils/validator/afiliationValidator";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";


@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    FooterComponent,
    SubheaderComponent,
    HeaderComponent,
    PasswordModule,
    CardModule,
    PasswordPolicyComponent,
    RegresarComponent,
    SecurityResponsePolicyComponent
  ],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [DialogService, MessageService, AlertService]
})
export class ChangePasswordComponent {

  token: string | null = null;
  validando = true;
  primeraPaso : number = 1;
  conteoBloqueo:number = 0;

  form = this.fb.group({
    code: [this.token, [Validators.required]],
    uid: ['', [Validators.required]],
    newPassword: ['', [Validators.required,passwordValidator()]],
    confirmPassword: ['', [Validators.required,passwordValidator()]],
    verificationCode: ['',[Validators.required]],

  }, { validators: matchValidator('newPassword', 'confirmPassword') } as AbstractControlOptions);

  //formulario de validación de respuesta de seguridad
  formSeguridad = this.fb.group({
    respuesta: ['', [Validators.required]]

  });

  public validationOptions = validationOptions;

  validationOption: ValidationType | null = null;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private securityService: SecurityService,
    private spiner: NgxSpinnerService,
    private fb: FormBuilder,
    private passwordCryptService: PasswordCryptService,
    private alertService: AlertService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {

     this.route.queryParamMap.subscribe(params => {
       this.token = params.get('token');
       const uid = params.get('uid');


       this.securityService.validateToken(this.token!, uid!).subscribe(
        {
          next: (response) => {
            this.validando = false;
            this.form.get('uid')?.setValue(uid);
          },
          error: (error: HttpErrorResponse) => {
            sessionStorage.setItem('vencido','1')
            this.router.navigate(['security/no-encontrado'])
          }
        }
       );

       this.form.get('code')?.setValue(this.token);
     });

    const index = 1;
    this.validationOption = this.validationOptions[index];

  }

  goToLogin() {
    this.router.navigate(['/security']);
  }

  async validarRespuestaSeguridad(){

    this.spiner.show();
    this.validando = true;
    const respuestaSeguridad = this.formSeguridad.get('respuesta')?.value;
     this.securityService.ValidateSecurityResponse('1',respuestaSeguridad!,this.token!).subscribe(
      {
        next: (response) => {
          this.validando = false;
          this.spiner.hide();
          if(response){
            this.primeraPaso = 2;
          }else{
            this.alertService.showError('', `Respuesta de seguridad es incorrecta`);
          }


        },
        error: (error: HttpErrorResponse) => {
          this.spiner.hide();
        }
      }
    );



  }

  async enviar() {
    this.spiner.show();
    this.validando = true;
    const {code, newPassword, uid, confirmPassword,verificationCode} = this.form.value;
    const pw = await this.passwordCryptService.encryptPassword(newPassword!)
    const oldPw = await this.passwordCryptService.encryptPassword(confirmPassword!)
    const codigo = await this.passwordCryptService.encryptPassword(verificationCode!)
    this.securityService.resetPassword({token: code!, pw, userId: uid!, oldPw,codigoVerificacion: codigo,idTipoVerificacion:3 }).subscribe(
      {
        next: (response) => {
          this.validando = false;
          this.spiner.hide();


          if (response.success) {
            let ref = this.alertService.showSuccess('Éxito', `Se cambió la contraseña con éxito.`);

            ref.onClose.subscribe(() => {
              this.router.navigate(['/security']);
            });

          }

        },
        error: (error: HttpErrorResponse) => {
            this.spiner.hide();
            this.validando = false;

            if (HttpStatusCode.NotFound == error.status) {
              /*const ref =  this.alertService.showWarning(``, `<div class="text-center" >La sesión ha caducado.</div><div class="text-center" >Vuelva a la opción de <strong>Recuperación de la cuenta.</strong></div>`);

              ref.onClose.subscribe(() => {
               this.router.navigate(['/security/sign-up/recuperar-cuenta']);
              });*/
              this.conteoBloqueo ++;

              if (this.conteoBloqueo === 5){

                const ref = this.alertService.showError(``, `La cuenta fue bloqueada`);
                ref.onClose.subscribe(() => {
                  this.router.navigate(['/security/sign-up/recuperar-cuenta']);
                });

              }else{

              this.alertService.showWarning(`Error`, `<div class="text-center" >${error.error.message}</div>`);

              }

              return;
            }
            if (HttpStatusCode.InternalServerError != error.status) {
              this.alertService.showWarning(`Error`, error.error.message);
              return;
            }
          this.alertService.showWarning(`Error`, `Ha ocurrido un error en el sistema, inténtelo nuevamente más tarde.`);



        }
      }
    )
  }

  disableEvent(event: ClipboardEvent): void {
    event.preventDefault();
  }

  obtenerTexto(texto: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(texto)
  }

}
