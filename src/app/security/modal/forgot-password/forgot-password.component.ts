import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StorageService } from 'src/app/casilla/service/storage.service';
import { ToastMessageService } from 'src/app/service/toast-message.service';
import { LoginResponse } from 'src/app/utiils/types';
import { matchValidator } from 'src/app/utiils/validator/match.validator';
import { SecurityService } from '../../service/security.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { AlertService } from 'src/app/service/Alert.service';
import { Button, ButtonModule } from 'primeng/button';
import { passwordValidator } from 'src/app/utiils/validator/password.validator';
import { environment } from 'src/environments/environment';
import { PasswordCryptService } from '../../service/password-crypt.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    MessagesModule,
    ToastModule,
    PasswordModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [ToastMessageService, MessageService, AlertService, DialogService]
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit, OnDestroy {

  activeIndex = 3
  sendingDni = false;
  validating = false;
  resetting = false;
  loggedUser!: LoginResponse;
  public appName: string = environment.APP_NAME

  private subs: Subscription[] = []

  @ViewChild('inputDNI') inputDNI: ElementRef | undefined;

  constructor(private fb: FormBuilder,
    private toastMessageService: ToastMessageService,
    private securityService: SecurityService,
    private dialogRef: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private alertService: AlertService,
    private pwService: PasswordCryptService,
    private storageService: StorageService) { }

  ngOnInit(): void {

    this.loggedUser = this.dialogRef.data;
    this.form.get('dni')?.setValue(this.loggedUser?.dni!);

  }

  get isDniInputValid() { return this.form.get('dni')?.valid }
  //get isCodeInputValid() { return this.form.get('code')?.valid }
  get isNewPasswordInputValid() { return this.form.get('newPassword')?.valid 
    && this.form.get('confirmPassword')?.valid 
    && this.form.get('password')?.valid }


  sendUser() {
    this.sendingDni = true;
    this.toastMessageService.clear();
    const dni = this.form.get('dni')?.value!;
    const dniSub = this.securityService.getbyDni(dni).subscribe(
      {
        next: (res) => {
          this.sendingDni = false;
          this.activeIndex = 2;
        },
        error: (err: HttpErrorResponse) => {
          this.sendingDni = false;
          this.toastMessageService.showError('El DNI ingresado no existe en nuestro sistema o es inválido');
        }
      }
    )

    this.subs.push(dniSub);
  }

  validateCode() {
    this.toastMessageService.clear();
    this.validating = true;
    this.toastMessageService.clear()
    const code = this.form.get('code')?.value!;
    const dni = this.form.get('dni')?.value!;

    const codeSub = this.securityService.validateCode({ dni, code }).subscribe(
      {
        next: (res) => {
          this.validating = false;
          this.activeIndex = 3;
        },
        error: (err: HttpErrorResponse) => {
          this.toastMessageService.showError('El código ingresado no es válido');
          this.validating = false;
        }
      }
    );

    this.subs.push(codeSub);
  }

  disableEvent(event: ClipboardEvent): void {
    event.preventDefault();
  }

  async resetPassword() {
    this.resetting = true;
    this.toastMessageService.clear();
    const userId = this.form.get('dni')?.value!;
    const pw = await this.pwService.encryptPassword(this.form.get('newPassword')?.value!);
    const code = this.form.get('code')?.value!;
    const oldPw = await this.pwService.encryptPassword(this.form.get('password')?.value!);

      const observable = this.securityService.changePassword({ userId: this.loggedUser.dni, pw, token: this.loggedUser.token, oldPw });
    

    const pwSub = observable.subscribe(
      {
        next: (res) => {
          this.resetting = false;

          this.ref.close(true);

          this.activeIndex = 4
        },
        error: (err: HttpErrorResponse) => {

          if (HttpStatusCode.InternalServerError != err.status) {
            this.alertService.showWarning('Actualización fallida', err.error?.message);
          } else {
            this.alertService.showWarning('Actualización fallida', 'Ha ocurrido un error al intentar actualizar la contraseña.');
          }

         
          this.resetting = false;

        }
      }
    )
    this.subs.push(pwSub);
  }

  ngAfterViewInit() {

    setTimeout(() => {
      this.inputDNI?.nativeElement.focus();
    }, 200)
  }

  form = this.fb.group({
    dni: ['', [Validators.minLength(8), Validators.maxLength(8), Validators.required]],
    //code: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8), passwordValidator()]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8), passwordValidator()]],
    password: ['', [Validators.minLength(8)]],

  }, { validators: matchValidator('newPassword', 'confirmPassword') } as AbstractControlOptions);

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  cancelar() {
    this.ref.close(false);
  }

}


