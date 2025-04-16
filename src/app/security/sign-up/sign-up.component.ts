import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuItem, MessageService } from 'primeng/api';
import { CaptchaService } from '../service/captcha.service';
import { Observable, Subscription, catchError, tap } from 'rxjs';
import { SMSService } from '../service/sms.service';
import { AffiliationRequest, IdType, SmsGenerateCodeResponse, UbigeoRespone } from 'src/app/utiils/types';
import { ToastMessageService } from 'src/app/service/toast-message.service';
import { ReniecService } from '../service/reniec.service';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { matchValidator } from 'src/app/utiils/validator/match.validator';
import { UbigeoService } from '../service/ubigeo.service';
import { AffiliationService } from '../service/affiliation.service';
import { Route, Router } from '@angular/router';
import { StepsModule } from 'primeng/steps';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { SubheaderComponent } from 'src/app/shared/components/subheader/subheader.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { CustomToastComponent } from 'src/app/shared/components/custom-toast/custom-toast.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    StepsModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    CardModule,
    ToastModule,
    HeaderComponent,
    SubheaderComponent,
    FooterComponent,
    CustomToastComponent
  ],
  providers: [ToastMessageService, MessageService, DatePipe]
})
export class SignUpComponent implements OnInit, OnDestroy {

  activeIndex = 0;
  captcha$!: Observable<string>;
  departamento$!: Observable<UbigeoRespone[]>;
  provincia$?: Observable<UbigeoRespone[]>;
  distrito$?: Observable<UbigeoRespone[]>;

  selectedGender = '';
  selectedDepartamento = '';
  selectedProvincia = '';
  selectedDistrito = '';
  casillaUrl= '-'

  loadingCaptcha = false;
  sendingCode = false;
  validatingSmsCode = false;
  validatingDni = false;
  loadingDistrito = false;
  loadingProvincia = false;
  loadingDepartamento = true;
  saving = false
  dd = new Date();
  public appName: string = environment.APP_NAME

  idTypes$!: Observable<IdType[]>;

  susbs: Subscription[] = [];

  steps: MenuItem[] = [{ label: 'Validación por Email', }, { label: 'Datos Personales', }, { label: 'Resumen', }];

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private captchaService: CaptchaService,
    private smsService: SMSService,
    private toastService: ToastMessageService,
    private reniecService: ReniecService,
    private datePipe: DatePipe,
    private ubigeoService: UbigeoService,
    private affiliationService: AffiliationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.refreshCaptcha()
    this.idTypes$ = this.reniecService.getIdTypes();
    this.departamento$ = this.ubigeoService.departamentos().pipe(catchError((e: HttpErrorResponse) => {
      this.toastService.showError(e.statusText);
      return [];
    }), tap((d) => { this.loadingDepartamento = false }));


  }


  sms() { this.activeIndex = 0; }
  review() {
    this.saving = true;

    const {departamento, provincia, distrito, gender , ...rest} = this.signUpForm.value;
    
const rq = {...rest, departamento: departamento?.id, provincia: provincia?.id, distrito: distrito?.id, gender: gender?.code} as AffiliationRequest;

    this.affiliationService.save(rq).subscribe({
      next: (d) => {
        this.toastService.showSuccess(`Registro exitoso`);
        this.saving = false;
        this.activeIndex = 2;
      },
      error: (e) => {
        this.saving = false;
        this.toastService.showError(e.message);
      }
    })
  }
  print() { window.print() }

  personalInfo() {
    this.toastService.clear()
    this.validatingSmsCode = true;
    const cellphone = this.signUpForm.get('email')?.value ?? '';
    const code = this.signUpForm.get('smsCode')?.value ?? '';

    const validateSub = this.smsService.validateCode({ cellphone, code })
      .pipe(
        catchError((e) => {
          const response = e.error as SmsGenerateCodeResponse
          this.toastService.showError(response.message);
          this.validatingSmsCode = false;
          return [];
        })
      ).subscribe({
        next: (d) => {
          this.toastService.showSuccess(`Validación exitosa, por favor ingrese sus datos personales`);
          this.validatingSmsCode = false;
          this.activeIndex = 1;
          this.signUpForm.get('email')?.setValue(cellphone)
        }
      })

    this.susbs.push(validateSub);

  }

  refreshCaptcha($evt?: any) {
    $evt?.preventDefault();
    this.loadingCaptcha = true;
    this.captcha$ = this.captchaService.getCaptcha()
      .pipe(
        catchError((e) => {
          this.loadingCaptcha = false;
          return [];
        }),
        tap((d) => {
          this.loadingCaptcha = false;
          return d
        })
      );
  }

  sendMessage() {
    this.sendingCode = true
    this.toastService.clear()
    const code = this.signUpForm.get('captcha')?.value ?? '';
    const cellphone = this.signUpForm.get('email')?.value ?? '';

    const sendCode = this.smsService.sendSMS({ cellphone, code })
      .pipe(
        catchError((e) => {
          const response = e.error as SmsGenerateCodeResponse;
          this.toastService.showError(response.message);
          this.sendingCode = false;
          return [];
        })
      ).subscribe({
        next: (d) => {
          this.sendingCode = false;
          this.toastService.showSuccess(`El código fue enviado a ${cellphone}, por favor revise su bandeja de entrada`);

        },
      });
    this.susbs.push(sendCode);

  }

  get isValid4Captcha() {
    return this.signUpForm.get('captcha')?.valid && this.signUpForm.get('email')?.valid;
  }

  get isValid4Sms() {
    return this.signUpForm.get('smsCode')?.valid && this.isValid4Captcha;
  }

  get isValid4Id() {
    return this.signUpForm.get('idType')?.valid && this.signUpForm.get('idNumber')?.valid && this.signUpForm.get('dueDate')?.valid;
  }

  renderBase64(baseb4Content: string | null) {
    if (!baseb4Content) return;
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${baseb4Content}`);
  }

  checkDni() {
    this.validatingDni = true
    this.toastService.clear();
    this.signUpForm.get('nombres')?.setValue('');
    this.signUpForm.get('apellidoPaterno')?.setValue('');
    this.signUpForm.get('apellidoMaterno')?.setValue('');

    const idType = this.signUpForm.get('idType')?.value ?? '';
    const idNumber = this.signUpForm.get('idNumber')?.value ?? '';
    const _dueDate = this.signUpForm.get('dueDate')?.value ?? new Date;
    const dueDate = this.datePipe.transform(_dueDate, 'shortDate');

    const subDni = this.reniecService.getDni(idNumber, dueDate!)
      .subscribe({
        next: (d) => {
          this.validatingDni = false;
          this.toastService.showSuccess(`El DNI ${idNumber} es válido`);

          this.signUpForm.get('nombres')?.setValue(d.nombres);
          this.signUpForm.get('apellidoPaterno')?.setValue(d.apellidoPaterno);
          this.signUpForm.get('apellidoMaterno')?.setValue(d.apellidoMaterno);

        },
        error: (e: HttpErrorResponse) => {
          this.validatingDni = false;
          let msg = 'Ha ocurrido un error al validar el número de DNI';
          if (e.status === HttpStatusCode.NotFound) {
            msg = 'El DNI es inválido';
          }
          this.toastService.showError(msg);
        }

      })

    this.susbs.push(subDni);
  }

  loadProvs($event: any) {
    const optionSelected = $event.value as UbigeoRespone
    this.selectedDepartamento = optionSelected.name
    this.loadingProvincia = true;
    const depId = optionSelected.id
    this.signUpForm.get('provincia')?.setValue(null)
    this.signUpForm.get('distrito')?.setValue(null);

    this.provincia$ = this.ubigeoService.provsByDeps(depId).pipe(catchError((e: HttpErrorResponse) => {
      this.toastService.showError(e.statusText);
      return [];
    }), tap((d) => { this.loadingProvincia = false }))
  }

  loadDist($event: any) {
    const optionSelected = $event.value as UbigeoRespone;
    this.selectedProvincia = optionSelected.name;
    this.loadingDistrito = true;
    const depId = this.signUpForm.get('departamento')?.value?.id!
    const provId = optionSelected.id
    this.signUpForm.get('distrito')?.setValue(null)
    this.distrito$ = this.ubigeoService.distByProvs(depId, provId).pipe(catchError((e: HttpErrorResponse) => {
      this.toastService.showError(e.statusText);
      return [];
    }), tap((d) => { this.loadingDistrito = false }))
  }

  signUpForm = this.fb.group({
    cellphone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
    captcha: ['', [Validators.required]],
    smsCode: ['', [Validators.required]],
    idType: ['', [Validators.required]],
    idNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
    dueDate: ['', [Validators.required]],
    nombres: ['', [Validators.required]],
    apellidoPaterno: ['', [Validators.required]],
    apellidoMaterno: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    emailConfirm: ['', [Validators.required, Validators.email]],
    gender: [{} as { name: string, code: string }, [Validators.required]],
    departamento: [{} as UbigeoRespone, [Validators.required]],
    provincia: [{} as UbigeoRespone, [Validators.required]],
    distrito: [{} as UbigeoRespone, [Validators.required]],
    direccion: ['', [Validators.required]],

  }, {
    validators: [matchValidator('email', 'emailConfirm')]
  } as AbstractControlOptions);

  ngOnDestroy(): void {
    this.susbs.forEach(s => s.unsubscribe());
    this.signUpForm.reset();
  }

  onChangeGender(event: any) {

    const optionSelected = event.value as { name: string, code: string };
    this.selectedGender = optionSelected.name;

  }

  onChangeDistrict($event: any) {
    const optionSelected = $event.value as UbigeoRespone;
    this.selectedDistrito = optionSelected.name;
    //this.signUpForm.get('distrito')?.setValue(optionSelected.id);
  }

  home() {
    this.router.navigate(['app']);
  }
  
}