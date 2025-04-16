import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AccountRecord } from 'src/app/utiils/types';
import { AccountService } from 'src/app/service/account.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ToastMessageService } from 'src/app/service/toast-message.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from 'primeng/dynamicdialog';
import { AlertService } from 'src/app/service/Alert.service';
import { soloNumeros } from 'src/app/utiils/funcs';
import { environment } from 'src/environments/environment';
import { CustomToastComponent } from 'src/app/shared/components/custom-toast/custom-toast.component';


@Component({
  selector: 'app-update-email',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    CustomToastComponent
  ],
  templateUrl: './update-email.component.html',
  styleUrls: ['./update-email.component.scss'],
  providers: [MessageService, ToastMessageService, AlertService, DialogService ]
})
export class UpdateEmailComponent implements OnInit {

  @Input() userData!: AccountRecord;

form = this.fb.group({
  email: [''],
  newEmail: ['', [Validators.email, Validators.required]],
  code: ['', [Validators.required]]
});

appName: string = environment.APP_NAME
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private toastMessageService: ToastMessageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {

    this.form.get('email')?.setValue(this.userData.correo);

  }

  sendValCode() {
    this.spinner.show()
    const email = this.form.get('newEmail')?.value!;

    this.accountService.sendEmail(email).subscribe(
      {
        next: (response) => {
          this.alertService.showSuccess(`Envío correcto`, 
          `El código de verificación fue enviado al correo electrónico proporcionado 
            y caducará al cabo de <strong>5 minutos</strong>.`);
            this.spinner.hide();
        },
        error: (error: HttpErrorResponse) => {
          this.spinner.hide();
          if (HttpStatusCode.InternalServerError != error.status) {
            this.toastMessageService.showError(error.error.message, `Error`);
            return;
          }

          this.toastMessageService.showError(`Ha ocurrido un error en el sistema, inténtelo nuevamente más tarde.`, `Error`);
        
        }
      }
     
    );
  }

  updateEmail() {
    this.spinner.show();
    const {email, newEmail, code} = this.form.value;
    this.accountService.updateEmail(
      {code: code!, email:newEmail!, oldEmail: email!}
    ).subscribe({
      next: (response) => {
        this.toastMessageService.showSuccess(`Su correo electrónico ha sido actualizado correctamente.`);
        this.spinner.hide();
        window.location.reload();
      }, error: (error: HttpErrorResponse) => {
        this.spinner.hide();
        if (HttpStatusCode.InternalServerError != error.status) {
          this.alertService.showWarning(`Verificación incorrecta`, error.error.message);
            return;
        }

        this.toastMessageService.showError(`Ha ocurrido un error en el sistema, inténtelo nuevamente más tarde.`, `Error`);
      }
      
    })
  }

  soloNumeros($event: any, controlName: string) {
    const input = $event.target;
    const numeros = soloNumeros(input.value ?? '');
    this.form.get(controlName)?.setValue(numeros, { emitEvent: false });
  }

}
