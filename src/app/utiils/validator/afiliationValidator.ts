import { ValidationField } from "../types";

export type ValidationType = {
    controlName: string,
    controlLabel: string,
    controlType: 'date' | 'text',
    placeholder: string,
    validationField: number,
    maxLength: number | null,
    minLength: number | null,
    help: {
      label: string,
      alt: string,
      url: string,
    }[],
  }

export const validationOptions: ValidationType[] = [
    {
      controlName: 'fechaEmision',
      controlLabel: 'Fecha de emisión del DNI',
      controlType: 'date',
      placeholder: 'Ingrese fecha de emisión de su DNI',
      validationField: ValidationField.FECHA_EMISION,
      maxLength: null,
      minLength: null,
      help: [
        {
          label: 'Ubicación de la fecha de emisión en DNI Azul',
          alt: 'DNI Azul',
          url: 'assets/images/dni/img_emision_dni_azul.png',
        },
        {
          label: 'Ubicación de la fecha de emisión en DNI Electrónico <strong>emitido hasta el 2019</strong>',
          alt: 'DNI Electrónico emitido hasta el 2019',
          url: 'assets/images/dni/img_emision_dni_electronico_2019.png',
        },
        {
          label: 'Ubicación de la fecha de emisión en DNI Electrónico <strong>emitido a partir de 2020</strong>',
          alt: 'DNI Electrónico emitido a partir de 2020',
          url: 'assets/images/dni/img_emision_dni_electronico_2020.png',
        },
      ]
    },
    {
      controlName: 'digitoVertificacion',
      controlLabel: 'Dígito de verificación',
      controlType: 'text',
      placeholder: 'Ingrese dígito de verificación',
      validationField: ValidationField.DIGITO_VERIFICACION,
      maxLength: 1,
      minLength: 1,
      help: [
        {
          label: 'Ubicación del dígito de verificación en el DNI azul',
          alt: 'DNI Azul',
          url: 'assets/images/dni/img_digito_dni_azul.png',
        },
        {
          label: 'Ubicación del dígito de verificación en el DNI Electrónico <strong>emitido hasta el 2019</strong>',
          alt: 'DNI Electrónico emitido hasta el 2019',
          url: 'assets/images/dni/img_digito_dni_electronico_2019.png',
        },
        {
          label: 'Ubicación del dígito de verificación en el DNI Electrónico <strong>emitido a partir de 2020</strong>',
          alt: 'DNI Electrónico emitido a partir de 2020',
          url: 'assets/images/dni/img_digito_dni_electronico_2020.png',
        },
      ]
    },
    {
      controlName: 'ubigeo',
      controlLabel: 'Ubigeo de nacimiento',
      controlType: 'text',
      placeholder: 'Ingrese número de ubigeo de su DNI',
      validationField: ValidationField.UBIGEO,
      maxLength: 6,
      minLength: 6,
      help: [
        {
          label: 'Ubicación del número de ubigeo en DNI Azul',
          alt: 'DNI Azul',
          url: 'assets/images/dni/ubigeo_azul.png',
        },
        {
          label: 'Ubicación del número de ubigeo en DNI Electrónico <strong>emitido hasta el 2019</strong>',
          alt: 'DNI Electrónico emitido hasta el 2019',
          url: 'assets/images/dni/ubigeo_2019.png',
        },
        {
          label: 'Ubicación del número de ubigeo en DNI Electrónico <strong>emitido a partir de 2020</strong>',
          alt: 'DNI Electrónico emitido a partir de 2020',
          url: 'assets/images/dni/ubigeo_2020.png',
        },
      ]
    },
    {
      controlName: 'nombreMadre',
      controlLabel: 'Nombre(s) de la madre',
      controlType: 'text',
      placeholder: 'Ingrese nombre(s) de su madre',
      validationField: ValidationField.NOMBRE_MADRE,
      maxLength: null,
      minLength: null,
      help: [
      ]
    },
    {
      controlName: 'nombrePadre',
      controlLabel: 'Nombre(s) del padre',
      controlType: 'text',
      placeholder: 'Ingrese nombre(s) de su padre',
      validationField: ValidationField.NOMBRE_PADRE,
      maxLength: null,
      minLength: null,
      help: [
      ]
    }
  ];