import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AuthTokenService } from 'src/app/casilla/service/auth-token.service';
import { PasswordCryptService } from 'src/app/security/service/password-crypt.service';
import { AccountService } from 'src/app/service/account.service';
import { ToastMessageService } from 'src/app/service/toast-message.service';
import { CustomToastComponent } from 'src/app/shared/components/custom-toast/custom-toast.component';
import { PasswordPolicyComponent } from 'src/app/shared/password-policy/password-policy.component';
import { matchValidator } from 'src/app/utiils/validator/match.validator';
import { passwordValidator } from 'src/app/utiils/validator/password.validator';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [
    CommonModule,
    PasswordModule,
    PasswordPolicyComponent,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    CustomToastComponent
  ],
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss'],
  providers: [MessageService, ToastMessageService]
})
export class UpdatePasswordComponent implements OnInit {

  validando = false;

  form = this.fb.group({
    oldPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, passwordValidator()]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: matchValidator('newPassword', 'confirmPassword') } as AbstractControlOptions);


  constructor(
    private fb: FormBuilder,
    private spiner: NgxSpinnerService,
    private accountService: AccountService,
    private authToken: AuthTokenService,
    private pwService: PasswordCryptService,
    private toastMessageService: ToastMessageService
  ) { }

  ngOnInit(): void {
      /** Empty  */
  }

  async enviar() {
    this.spiner.show();
    this.validando = true;
    const {newPassword, oldPassword} = this.form.value;
    const pw = await this.pwService.encryptPassword(newPassword!);
    const oldPw = await this.pwService.encryptPassword(oldPassword!);
    this.accountService.updatePassword({token: '', pw , userId: new Date().toTimeString(), oldPw}).subscribe(
      {
        next: (response) => {
          this.validando = false;
          this.spiner.hide();
          this.toastMessageService.showSuccess( `Su contraseña ha sido actualizada correctamente.`, `Éxito`);
          this.form.reset();
          setTimeout(() => {
            this.authToken.logout();
          }, 2000)
          
        },
        error: (error: HttpErrorResponse) => {
            this.spiner.hide();
            this.validando = false;
            if (HttpStatusCode.InternalServerError != error.status) {
              this.toastMessageService.showWarn(error.error.message, `Error`);
              return;
            }

            this.toastMessageService.showError(`Ha ocurrido un error en el sistema, inténtelo nuevamente más tarde.`, `Error`);
                   
          
        }
      }
    )
  }

}
