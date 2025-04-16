import { CommonModule, KeyValue } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {RecaptchaComponent, RecaptchaFormsModule, RecaptchaModule} from 'ng-recaptcha';
import { NgxSpinnerService } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { Subscription, from } from 'rxjs';
import { DtoService } from 'src/app/security/service/dto.service';
import { MaestrosService } from 'src/app/security/service/maestros.service';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { CustomToastComponent } from 'src/app/shared/components/custom-toast/custom-toast.component';
import { soloNumeros } from 'src/app/utiils/funcs';
import { DOBLE_PERFIL, ListItemResponse, PersonaNaturalAfiliacion, TIPO_PERSONA, ValidationField } from 'src/app/utiils/types';
import { ValidationType, validationOptions } from 'src/app/utiils/validator/afiliationValidator';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-identificacion',
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
    CalendarModule,
    CustomToastComponent
  ],
  templateUrl: './identificacion.component.html',
  styleUrls: ['./identificacion.component.scss'],
})
export class IdentificacionComponent implements OnInit, OnDestroy, OnChanges {

  @Input()
  tipoPersona = DOBLE_PERFIL.NATURAL;
  @Input()
  actualizarCaptcha = false;

  @Output()
  alVerificar = new EventEmitter<PersonaNaturalAfiliacion>();
  @ViewChild('captchaRef') captchaRef: RecaptchaComponent | undefined;

  tokenOK = false;
  siteKey = environment.CAPTCHA_SITE_KEY;
  tiposDocumento: ListItemResponse[] = [];

  subs = new Subscription();
  changing = false;

  fieldsToValidate = ['fechaEmision', 'digitoVertificacion', 'ubigeo', 'nombreMadre', 'nombrePadre'];
  fieldValidators: { [key: string]: any } = {
    fechaEmision: [Validators.required],
    digitoVertificacion: [Validators.required, Validators.maxLength(1), Validators.minLength(1)],
    ubigeo: [Validators.minLength(6), Validators.maxLength(6), Validators.required],
    nombreMadre: [Validators.required],
    nombrePadre: [Validators.required],
  }

  ngOnChanges(changes: SimpleChanges) {
    const onChangeCaptcha = changes['actualizarCaptcha'];
    if (onChangeCaptcha?.currentValue) {
      console.log('actualizarCaptcha');
      this.captchaRef?.reset();
    }
  }


  colegioAbogado$ = this.maestrosService.colegioDeAbogados();

  form = this.fb.group(
    {
      tipoDocumento: [1, [Validators.required]],
      numeroDocumento: ['', [Validators.required, Validators.maxLength(8), Validators.minLength(8)]],
      nombres: ['', [Validators.required]],
      apellidoPaterno: ['', [Validators.required]],
      apellidoMaterno: ['', [Validators.required]],
      //fechaEmision: ['', [Validators.required]],
      //digitoVertificacion: ['', [Validators.required]],
      idColegio: [''],
      numeroColegiatura: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
      validation: this.fb.group(
        {
          fechaEmision: [''],
          digitoVertificacion: ['', [Validators.maxLength(1), Validators.minLength(1)]],
          ubigeo: ['', [Validators.minLength(6), Validators.maxLength(6)]],
          nombreMadre: [''],
          nombrePadre: [''],
        }
      ),
      token: ['', [Validators.required]]
    }
  );

  public validationOptions = validationOptions;

  validationOption: ValidationType | null = null;

  constructor(private fb: FormBuilder,
    private maestrosService: MaestrosService,
    private dtoService: DtoService,
    private spiner: NgxSpinnerService,
    private analitycs: AnalyticsService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {

    this.changeValidator();

    const datos = this.dtoService.getPersonaNatural();

    this.analitycs.trackEvent('registro_step1', null);

    if (datos) {
      this.form.patchValue(datos);
    }

    this.subs.add(
      this.maestrosService.tiposDeDocumento().subscribe(
        {
          next: (response) => {
            this.tiposDocumento = response;
          }
        }
      )
    );


    if (this.esAbogado) {
      this.form.get('idColegio')?.setValidators([Validators.required, Validators.maxLength(5), Validators.minLength(5)]);
      this.form.get('numeroColegiatura')?.setValidators(Validators.required);
    } else {
      this.form.get('idColegio')?.clearValidators();
      this.form.get('numeroColegiatura')?.clearValidators();
    }

  }

  verificarDatos() {

    this.spiner.show();
    this.patchPeronaNatural();
    const personaNatural = this.form.value as PersonaNaturalAfiliacion;
    personaNatural.validation = {
      validationField: this.validationOption?.validationField,
      validationValue: this.form.get('validation')?.get(this.validationOption?.controlName!)?.value
    }
    if (this.validationOption?.validationField == ValidationField.FECHA_EMISION) {
      personaNatural.fechaEmision = this.form.get('validation')?.get(this.validationOption?.controlName)?.value
    }

    Object.keys(personaNatural).forEach(key => {
      const value = personaNatural[key];
      if (typeof value === 'string') {
        personaNatural[key] = value.trim();
      }
    });
    this.alVerificar.emit(this.form.value as PersonaNaturalAfiliacion);
  }

  patchPeronaNatural() {
    const tipoDocumentoLabel = this.tiposDocumento.find(x => x.id == this.form.value.tipoDocumento)?.nombre;
    this.dtoService.patchPersonaNatural({ tipoDocumentoLabel });
  }

  randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  cancelar() {    //back
    window.history.back();
  }

  errored(e: any) {
    this.form.get('token')?.setValue(null);
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

  get disabledButton() {
    return !this.form.valid || !this.tokenOK;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  soloNumeros($event: any, controlName: string, parent: null | string = null) {
    const input = $event.target;
    const numeros = soloNumeros(input.value ?? '');
    if (!parent)
      this.form.get(controlName)?.setValue(numeros, { emitEvent: false });
    else
      this.form.get(parent)?.get(controlName)?.setValue(numeros, { emitEvent: false });
  }

  upperCase($event: any, controlName: string, parent: null | string = null) {
    const value = $event.target.value;
    const uppercaseValue = value.toUpperCase();
    if (value !== uppercaseValue) {
      if (!parent)
        this.form.get(controlName)?.setValue(uppercaseValue, { emitEvent: false });
      else
        this.form.get(parent)?.get(controlName)?.setValue(uppercaseValue, { emitEvent: false });
    }
  }

  get esAbogado() {
    return this.tipoPersona == DOBLE_PERFIL.ABOGADO;
  }

  obtenerTexto(texto: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(texto)
  }

  changeValidator(evt: MouseEvent | null = null, currentValidator: ValidationType | null = null) {
    evt?.preventDefault();
    this.changing = true;
    this.spiner.show();
    this.validationOption = null;
    this.fieldsToValidate.forEach((v) => {
      this.form.get('validation')?.get(v)?.setValue('');
      this.form.get('validation')?.get(v)?.clearValidators();
      this.form.get('validation')?.get(v)?.updateValueAndValidity();
    });

    setTimeout(() => {
      const index = this.randomNumber(0, this.validationOptions.length - 1);
      this.validationOption = this.validationOptions[index];
      this.form.get('validation')?.get(this.validationOption.controlName)?.setValidators(this.fieldValidators[this.validationOption.controlName]);
      this.form.get('validation')?.get(this.validationOption.controlName)?.updateValueAndValidity();

    this.changing = false;
    this.spiner.hide();
    }, 500);

  }

  onlyNumbersValidation($event: any, validationOption: ValidationType) {
    /**
     * enlace
     */

    if (
      ValidationField.DIGITO_VERIFICACION == validationOption.validationField
      || ValidationField.UBIGEO == validationOption.validationField
    ) {
      this.soloNumeros($event, validationOption.controlName, 'validation');
    } else {
      this.upperCase($event, validationOption.controlName, 'validation');
    }
  }

  findAttributeWithValue(formGroup: FormGroup): string | null {
    const formControls = Object.keys(formGroup.controls);

    for (const control of formControls) {
      const controlValue = formGroup.get(control)?.value;
      if (controlValue && controlValue.length > 0) {
        return control;
      }
    }

    return null;
  }


}
