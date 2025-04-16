import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/service/account.service';
import { ToastMessageService } from 'src/app/service/toast-message.service';
import { AccountRecord, TIPO_PERSONA } from 'src/app/utiils/types';
import { AuthTokenService } from '../service/auth-token.service';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { EnableLawyerComponent } from './partials/enable-lawyer/enable-lawyer.component';
import { UpdateEmailComponent } from './partials/update-email/update-email.component';
import { UpdatePasswordComponent } from './partials/update-password/update-password.component';
import { AlertService } from 'src/app/service/Alert.service';
import { DialogService } from 'primeng/dynamicdialog';
import { CustomToastComponent } from 'src/app/shared/components/custom-toast/custom-toast.component';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [
    CommonModule,
    TabViewModule,
    ReactiveFormsModule,
    FormsModule,
    PasswordModule,
    ToastModule,
    InputTextModule,
    ButtonModule,
    EnableLawyerComponent,
    UpdateEmailComponent,
    UpdatePasswordComponent,
    CustomToastComponent
  ],
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
  providers: [MessageService, ToastMessageService, AlertService, DialogService]
})
export class MyAccountComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  updatingUserData = false;
  updatingPassword = false;
  userData: AccountRecord | null = null;

  constructor(
    private accountService: AccountService,
    private toastMessageService: ToastMessageService,
    private authTokenService: AuthTokenService) { }


  ngOnInit() {

    const acc = this.accountService.getUserAccountData().subscribe({
      next: (data) => {
        /** Just to use later */
        this.userData = data;
        // this.dataForm.get('email')?.setValue(data.correo);
        // this.dataForm.get('name')?.setValue(`${data.nombre} ${data.apePat} ${data.apeMat}`);
        // this.dataForm.get('dni')?.setValue(data.numDoc);
        // this.dataForm.get('cellphone')?.setValue(data.cellphone);
      }
    })
    this.subs.push(acc);
  }

  get esPersonaNatural() {
    return TIPO_PERSONA.NATURAL = this.authTokenService.decoded?.tipo!;
  }


  // dataForm = this.fb.group({
  //   email: ['', [Validators.required, Validators.email]],
  //   name: ['', [Validators.required, Validators.minLength(3)]],
  //   dni: ['', [Validators.required, Validators.minLength(8)]],
  //   cellphone: ['', [Validators.required, Validators.minLength(8)]],
  // });

  // form = this.fb.group({
  //   newPassword: ['', [Validators.required,  Validators.minLength(8)]],
  //   confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
  //   password: ['', [Validators.minLength(8),  Validators.required]],

  // }, { validators: matchValidator('newPassword', 'confirmPassword') } as AbstractControlOptions);

  // updatePassword() {
  //   this.toastMessageService.clear();
  //   this.updatingPassword = true;
  //   if (!this.form.valid) return ;
  //   const acc = this.accountService.updatePassword({
  //     oldPw: this.form.get('password')?.value!,
  //     pw: this.form.get('newPassword')?.value!,
  //     userId: this.userData?.numDoc!,
  //     /** Just mocking a random code */
  //     code: Math.random().toString(16).slice(7)

  //   }).subscribe({
  //     next: (data) => {
  //       this.toastMessageService.showSuccess('Datos actualizados correctamente,  inicia sesion nuevamente para ver los cambios');
  //       setTimeout(() => {
  //         this.authTokenService.logout();
  //       }, 2000);
  //       this.updatingPassword = false;
  //     }, 
  //     error: (err) => {
  //       this.toastMessageService.showError(`Ha ocurrido un error al actualizar la contraseña`);
  //       this.updatingPassword = false;

  //     }
  //   })

  //   this.subs.push(acc);
  // }

  // updateUserData() {
  //   this.toastMessageService.clear();
  //   this.updatingUserData = true;
  //   if (!this.dataForm.valid) return ;

  //   const acc = this.accountService.updateUserData({
  //     correo: this.dataForm.get('email')?.value!,
  //     nombre: this.userData?.nombre!,
  //     numDoc: this.userData?.numDoc!,
  //     cellphone: this.dataForm.get('cellphone')?.value!,
  //     apePat: this.userData?.apePat!,
  //     apeMat: this.userData?.apeMat!,
  //     flagActCta: this.userData?.flagActCta!,
  //     tipoUsr: this.userData?.tipoUsr!,
  //   }).subscribe({
  //     next: (data) => {
  //       this.toastMessageService.showSuccess('Datos actualizados correctamente');
  //       this.updatingUserData = false;
  //     },
  //     error: (err) => {
  //       this.toastMessageService.showError(`Ha ocurrido un error al actualizar los datos`);
  //       this.updatingUserData = false;
  //     }
  //   })
  //   this.subs.push(acc);

  // }


  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}


