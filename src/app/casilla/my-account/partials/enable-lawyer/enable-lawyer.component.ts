import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { CheckboxModule } from 'primeng/checkbox'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { CardModule } from 'primeng/card'
import { AuthTokenService } from 'src/app/casilla/service/auth-token.service'
import { AccountRecord, FLAG_STATUS, TIPO_PERSONA, UpdateProfileRequest } from 'src/app/utiils/types'
import { AccountService } from 'src/app/service/account.service'
import { ToastMessageService } from 'src/app/service/toast-message.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { HttpStatusCode } from '@angular/common/http'
import { AlertService } from 'src/app/service/Alert.service'
import { Subscription } from 'rxjs'
import { soloNumeros } from 'src/app/utiils/funcs'
import { MaestrosService } from 'src/app/security/service/maestros.service'
import { environment } from 'src/environments/environment'
import { CustomToastComponent } from 'src/app/shared/components/custom-toast/custom-toast.component'

@Component({
  selector: 'app-enable-lawyer',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    DropdownModule,
    CardModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    CustomToastComponent
  ],
  templateUrl: './enable-lawyer.component.html',
  styleUrls: ['./enable-lawyer.component.scss'],
  providers: [MessageService, ToastMessageService]
})
export class EnableLawyerComponent implements OnInit, OnDestroy {

  currentUser = this.authToken.decoded
  @Input() userData!: AccountRecord

  private twoFAUpdating: boolean = false
  private readonly subs = new Subscription()

  form = this.fb.nonNullable.group({
    personaNatural: [false, [Validators.requiredTrue]],
    abogado: [false, [Validators.requiredTrue]],
    numeroCasilla: ['', [Validators.required]],
    idColegioAbogados: ['', [Validators.required]],
    numeroColegiatura: ['', [Validators.maxLength(5), Validators.minLength(5)]],
    twoFactorAuthActivated: [false]
  })
  colegios$ = this.maestrosServices.colegioDeAbogados()

  appName: string = environment.APP_NAME

  constructor(
    private readonly fb: FormBuilder,
    private readonly authToken: AuthTokenService,
    private readonly accountService: AccountService,
    private readonly spinner: NgxSpinnerService,
    private readonly toastMessageService: ToastMessageService,
    private readonly alertService: AlertService,
    private readonly maestrosServices: MaestrosService
  ) { }

  ngOnInit(): void {

    this.form.get('numeroCasilla')?.setValue(this.userData.numDoc)

    if (this.currentUser?.tipo == TIPO_PERSONA.NATURAL) {
      this.form.get('personaNatural')?.setValue(true)
      this.form.get('personaNatural')?.disable()
    }

    if (this.currentUser?.tipo == TIPO_PERSONA.NATURAL && this.currentUser?.abogado == FLAG_STATUS.ACTIVO) {
      this.form.get('abogado')?.setValue(true)
      this.form.get('abogado')?.disable()
      this.form.get('idColegioAbogados')?.setValue(this.userData?.otros?.idColegioAbogados!)
      this.form.get('numeroColegiatura')?.setValue(this.userData?.otros?.nuColegio!)
      this.form.get('idColegioAbogados')?.disable()
      this.form.get('numeroColegiatura')?.disable()
    } else {
      this.form.get('abogado')?.setValue(false)
      this.form.get('abogado')?.enable()
    }

    // this.form.get('abogado')?.valueChanges.subscribe(value => {
    //   if (value) {
    //     this.form.get('idColegioAbogados')?.addValidators(Validators.required)
    //     this.form.get('idColegioAbogados')?.updateValueAndValidity()
    //     this.form.get('numeroColegiatura')?.addValidators(Validators.required)
    //     this.form.get('numeroColegiatura')?.updateValueAndValidity()
    //   } else {
    //     this.form.get('idColegioAbogados')?.clearValidators()
    //     this.form.get('idColegioAbogados')?.updateValueAndValidity()
    //     this.form.get('numeroColegiatura')?.clearValidators()
    //     this.form.get('numeroColegiatura')?.updateValueAndValidity()
    //   }
    // })

    this.validate2FA()

  }

  update() {

    const confirm = this.alertService.showConfirm(`Activación de doble perfil`, `
    Estimado usuario, está a punto de activar su ${ this.appName } para la notificación 
    de trámites relacionados a procesos penales en los que usted forma parte en calidad 
    de sujeto procesal y abogado defensor. <strong>Esta acción no podría revertirse.</strong> ¿Desea continuar?`,
      {
        cancelLabel: `No, cancelar`,
        confirmLabel: `Sí, continuar`
      }
    )

    confirm.onClose.subscribe(ok => {
      if (ok) {
        this.spinner.show()
        this.subs.add(
          this.accountService.updateProfile(this.form.value as UpdateProfileRequest).subscribe({
            next: (response) => {
              this.spinner.hide()
              const ref = this.alertService.showSuccess(
                `Activación satisfactoria de doble perfil `,
                `Se activó correctamente el doble perfil para su ${ this.appName }. Debe cerrar 
                su sesión para visualizar los cambios.`, { confirmLabel: 'Cerrar sesión' })

              ref.onClose.subscribe(() => {
                this.authToken.logout()
              })

            },
            error: (error) => {
              this.spinner.hide()
              if (HttpStatusCode.InternalServerError != error.status) {
                this.toastMessageService.showError(error.error.message, `Error`)
                return
              }
              this.toastMessageService.showError(`Ha ocurrido un error en el sistema, inténtelo nuevamente más tarde.`, `Error`)
            }
          })
        )
      }
    })


  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  soloNumeros($event: any, controlName: string) {
    const input = $event.target
    const numeros = soloNumeros(input.value ?? '')
    this.form.get(controlName)?.setValue(numeros, { emitEvent: false })
  }

  disabled() {
    return this.form.invalid || this.currentUser?.tipo == TIPO_PERSONA.NATURAL && this.currentUser?.abogado == FLAG_STATUS.ACTIVO
  }

  get hideControls() {
    return this.currentUser?.tipo == TIPO_PERSONA.NATURAL && this.currentUser?.abogado == FLAG_STATUS.ACTIVO
  }

  private validate2FA(): void {
    this.subs.add(
      this.accountService.validate2FA().subscribe({
        next: (resp) => {
          this.spinner.hide()
          this.twoFAUpdating = true
          let is2FAactivated = resp.message === 'OK'
          this.form.get('twoFactorAuthActivated')?.setValue(is2FAactivated)
          this.twoFAUpdating = false
        },
        error: (error) => {
          this.spinner.hide()
          if (HttpStatusCode.InternalServerError != error.status) {
            this.toastMessageService.showError(error.error.message, `Error`)
            return
          }
          this.toastMessageService.showError(`Ha ocurrido un error en el sistema, inténtelo nuevamente más tarde.`, `Error`)
        }
      })
    )
  }

  protected manage2FA(value: boolean): void {

    if ( !this.twoFAUpdating ) {

      const newValue: boolean = value
      this.twoFAUpdating = true
      setTimeout(() => {
        this.form.get('twoFactorAuthActivated')?.setValue(!newValue)
        this.twoFAUpdating = false
      }, 0)

      let title: string = 'Activación'
      let action: string = 'habilitar'
      let action2: string = 'activó'
      let message: string = 'Esta medida aumentará la seguridad de su cuenta y será requerida en cada inicio de sesión. En caso de ser necesario, podrá desactivarla más adelante desde la configuración de su cuenta'

      if ( !newValue ) {
        title = 'Desactivación'
        action = 'deshabilitar'
        action2 = 'desactivó'
        message = 'Recuerde que esta medida aumenta la seguridad de su cuenta en cada inicio de sesión. En caso de ser necesario, podrá activarla más adelante desde la configuración de su cuenta'
      }
      
      const confirm = this.alertService.showConfirm(`${title} de autenticación de doble factor`, `
        Estimado usuario, está a punto de ${action} la <strong>autenticación de doble factor</strong> para su ${ this.appName }.
        ${message}. <strong>¿Está seguro de que desea continuar?</strong>`,
          {
            cancelLabel: `No, cancelar`,
            confirmLabel: `Sí, continuar`
          }
        )
        confirm.onClose.subscribe(ok => {
          if (ok) {
            this.spinner.show()
            this.subs.add(
              this.accountService.activate2FA(value ? '1' : '0').subscribe({
                next: () => {
                  this.spinner.hide()
                  this.twoFAUpdating = true
                  this.form.get('twoFactorAuthActivated')?.setValue(newValue)
                  this.twoFAUpdating = false
                  const ref = this.alertService.showSuccess(
                    `${title} satisfactoria de autenticación de doble factor`,
                    `Se ${action2} correctamente el doble factor de autenticación para su ${ this.appName }. Debe cerrar 
                    su sesión para visualizar los cambios.`, { confirmLabel: 'Cerrar sesión' })
                  ref.onClose.subscribe(() => {
                    this.authToken.logout()
                  })
                },
                error: (error) => {
                  this.spinner.hide()
                  if (HttpStatusCode.InternalServerError != error.status) {
                    this.toastMessageService.showError(error.error.message, `Error`)
                    return
                  }
                  this.toastMessageService.showError(`Ha ocurrido un error en el sistema, inténtelo nuevamente más tarde.`, `Error`)
                }
              })
            )
          }
        })
    }
  }

}
