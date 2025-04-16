import {Component, OnInit, ViewChild} from '@angular/core'
import {Router} from '@angular/router'
import {DialogService, DynamicDialogModule, DynamicDialogRef} from 'primeng/dynamicdialog'
import {ForgotPasswordComponent} from '../modal/forgot-password/forgot-password.component'
import {Title} from '@angular/platform-browser'
import {environment} from 'src/environments/environment'
import {MessageService} from 'primeng/api'
import {SecurityService} from '../service/security.service'
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms'
import {HttpErrorResponse, HttpResponse, HttpStatusCode} from '@angular/common/http'
import {LoginResponse} from 'src/app/utiils/types'
import {AuthTokenService} from 'src/app/casilla/service/auth-token.service'
import {ToastMessageService} from 'src/app/service/toast-message.service'
import {CommonModule} from '@angular/common'
import {PasswordModule} from 'primeng/password'
import {CardModule} from 'primeng/card'
import {ToastModule} from 'primeng/toast'
import {InputTextModule} from 'primeng/inputtext'
import {ButtonModule} from 'primeng/button'
import {HeaderComponent} from 'src/app/shared/components/header/header.component'
import {SubheaderComponent} from 'src/app/shared/components/subheader/subheader.component'
import {AlertService} from 'src/app/service/Alert.service'
import {RecaptchaComponent, RecaptchaFormsModule, RecaptchaModule} from 'ng-recaptcha'
import {AfiliacionBoxComponent} from './afiliacion-box/afiliacion-box.component'
import {handleErrorWithToast} from 'src/app/utiils/funcs'
import {catchError, interval, Subscription} from 'rxjs'
import {RegresarComponent} from 'src/app/utiils/regresar/regresar.component'
import {CustomToastComponent} from 'src/app/shared/components/custom-toast/custom-toast.component'
import {animate, state, style, transition, trigger} from '@angular/animations'
import {PasswordCryptService} from '../service/password-crypt.service'
import { UserInfoService } from '../service/user-info.service'
import { NgOtpInputModule } from 'ng-otp-input'
import { SecurityTwoFactorAuthBoxComponent } from './security-two-factor-auth-box/security-two-factor-auth-box.component'
import { AccountLockModalComponent } from './account-lock-modal/account-lock-modal.component'

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PasswordModule,
    CardModule,
    ToastModule,
    InputTextModule,
    ButtonModule,
    HeaderComponent,
    DynamicDialogModule,
    SubheaderComponent,
    RecaptchaModule,
    RecaptchaFormsModule,
    AfiliacionBoxComponent,
    RegresarComponent,
    CustomToastComponent,
    NgOtpInputModule,
    SecurityTwoFactorAuthBoxComponent
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  providers: [DialogService, MessageService, ToastMessageService, AlertService, PasswordCryptService],
  animations: [
    trigger('fadeAnimation', [
      state('void', style({opacity: 0})),
      state('*', style({opacity: 1})),
      transition('void <=> *', animate('300ms ease-in-out'))
    ])
  ]
})
export class SignInComponent implements OnInit {

  ref!: DynamicDialogRef
  ref2!: DynamicDialogRef
  authenticating = false

  ip: string = ''
  usuario: string = ''
  correo: string = ''
  idEtapa: number = 1

  showTooltip = false

  tokenOK = false
  siteKey = environment.CAPTCHA_SITE_KEY
  appName = environment.APP_NAME

  otpCode: string = ''
  configOtp = { length: 6, allowNumbersOnly: true }

  countdown: number = 0
  isCountdownActive: boolean = false
  private countdownSubscription?: Subscription

  private timeoutHandler: any

  @ViewChild('captchaRef') captchaRef: RecaptchaComponent | undefined

  constructor(
    private readonly router: Router,
    private readonly dialogService: DialogService,
    private readonly browserService: Title,
    private readonly securityService: SecurityService,
    private readonly authService: AuthTokenService,
    private readonly alertService: AlertService,
    private readonly fb: FormBuilder,
    private readonly passwordCryptService: PasswordCryptService,
    private readonly toastMessageService: ToastMessageService,
    private readonly userInfoService: UserInfoService
  ) {
  }

  ngOnInit(): void {
    this.browserService.setTitle(`${environment.APP_NAME_TITLE}`)
    window.scrollTo({top: 0, behavior: 'smooth'})
    this.obtenerIp()
  }

  ngOnDestroy(): void {
    this.countdownSubscription?.unsubscribe()
    this.cleanTimer()
  }

  async obtenerIp() {
    this.ip = await this.userInfoService.getIPAddress()
  }

  async goToSignUpPage() {
    await this.router.navigate(['security', 'sign-up'])
  }

  get isOtpInputValid(): boolean {
    return this.otpCode.length === 6
  }

  get es2FA(): boolean {
    return this.idEtapa === 2
  }

  openForgotPassword($event: any) {
    $event.preventDefault()
    this.router.navigate(['security', 'sign-up', 'recuperar-cuenta'])
  }

  async login() {
    this.toastMessageService.clear()
    this.authenticating = true
    const request = this.form.value
    request.password = await this.passwordCryptService.encryptPassword(request.password!)
    request.ip = await this.passwordCryptService.encryptPassword(this.ip)
    request.dispositivo = await this.passwordCryptService.encryptPassword(this.userInfoService.getDeviceInfo())

    if ( this.isOtpInputValid ) {
      request.code = await this.passwordCryptService.encryptPassword(this.otpCode)
    } else {
      request.code = null
    }

    this.securityService.login(request)
      .pipe(
        catchError((error: HttpErrorResponse) => handleErrorWithToast(error, this.toastMessageService))
      ).subscribe(
      {
        next: (response: HttpResponse<LoginResponse>) => {
          const res = response.body
          this.authenticating = false
          if (response.status === HttpStatusCode.Accepted) {
            /* Handle 2FA */
            if ( response.body?.token.includes("Validar 2FA") ) {
              this.correo = response.body?.dni
              this.usuario = response.body?.user
              this.idEtapa = 2
              this.startTimer()
              return
            }

            /* Handle First login */
            this.ref2 = this.dialogService.open(ForgotPasswordComponent, {
              width: `500px`,
              styleClass: 'forgot-password-modal',
              header: 'Actualizar contraseña',
              data: {...response.body}
            })

            this.ref2.onClose.subscribe((ok: boolean) => {
              if (ok) {
                this.alertService.showSuccess('Actualización correcta', `Su contraseña ha sido actualizada.`)
              }
            })

            return
          }

          this.authService.saveToken(res?.token!)
          window.location.reload()
        },
        error: (er: HttpErrorResponse) => {
          this.captchaRef?.reset()
          this.authenticating = false
          if ( 
            er?.error?.message.includes('La Casilla Fiscal Electrónica se encuentra bloqueada') ||
            er?.error?.message.includes('Cuenta bloqueada porque se ha alcanzado el número máximo de intentos permitidos')
          ) {
            //Mostrar modal de cuenta bloqueada
            const ref3 = this.dialogService.open(AccountLockModalComponent, {
              width: `500px`,
              styleClass: 'forgot-password-modal',
              showHeader: false,
              closable: true
            })
            ref3.onClose.subscribe(() => {
              this.reload()
            })
          }
          if (er?.error?.message.includes('Tener en cuenta que le quedan')) {
            const title: string = er?.error?.message.includes('Código de verificación incorrecto') ? 'Código de verificación incorrecto' : 'El usuario y/o contraseña ingresada es incorrecta'
            this.alertService.showWarning(title, er?.error?.message.split('|')[1])
          }
        },
      }
    )

  }

  form = this.fb.group(
    {
      usuario: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      password: ['', [Validators.required]],
      token: ['', [Validators.required]],
      ip: [''],
      dispositivo: [''],
      code: ['']
    }
  )


  showToolT() {
    this.showTooltip = true
  }

  hideToolT() {
    this.showTooltip = false
  }

  resolved(e: any, captcha: RecaptchaComponent) {

    if (!e) {
      this.tokenOK = false
      this.form.get('token')?.setValue(null)
      return
    }
    this.form.get('token')?.setValue(e)
    this.tokenOK = true

  }

  errored(e: any, captcha: RecaptchaComponent) {
    this.form.get('token')?.setValue(null)
  }

  async onResendCode(): Promise<void> {
    if (this.isCountdownActive) return
    const request = {
      usuario: await this.passwordCryptService.encryptPassword(this.usuario),
      ipUsuario: await this.passwordCryptService.encryptPassword(this.ip),
      dispositivo: await this.passwordCryptService.encryptPassword(this.userInfoService.getDeviceInfo()),
    }
    this.securityService.resentCode2FA(request).subscribe(
      {
        next: () => {
          this.alertService.showSuccess('Código reenviado satisfactoriamente', 'Se ha reenviado un nuevo código de verificación a su correo registrado.')
          this.startCountdown()
        },
        error: (er: HttpErrorResponse) => {
          this.captchaRef?.reset()
          this.authenticating = false
        },
      }
    )
  }

  private startCountdown(): void {
    this.isCountdownActive = true
    this.countdown = environment.TIME_TO_RESEND_CODE

    this.countdownSubscription?.unsubscribe()

    this.countdownSubscription = interval(1000).subscribe(() => {
      if (this.countdown > 0) {
        this.countdown--
      } else {
        this.isCountdownActive = false
        this.countdownSubscription?.unsubscribe()
      }
    })
  }

  get formattedCountdown(): string {
    const minutes = Math.floor(this.countdown / 60)
    const seconds = this.countdown % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  private startTimer(): void {
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler)
    }
    this.timeoutHandler = setTimeout(() => {
      this.mostrarModalTiempoAgotado()
    }, environment.MAX_TIME_2FA * 1000)
  }

  private mostrarModalTiempoAgotado(): void {
    const ref = this.alertService.showWarning('Tiempo agotado','Por seguridad, se ha superado el tiempo máximo permitido <b>(10 min)</b> para verificar el código. Por favor, vuelve a iniciar sesión para generar un nuevo código de autenticación.')
    ref.onClose.subscribe(() => {
      this.reload()
    })
  }

  private cleanTimer(): void {
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler)
      this.timeoutHandler = null
    }
  }

  reload(): void {
    window.location.reload()
  }

  onOtpChange( value: string ): void {
    this.otpCode = value
  }

  validateCode(): void {
    this.form.get('code')?.setValue(this.otpCode)
    this.login()
  }

}

