import {AbstractControl,  ValidatorFn} from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const value: string = control.value;

    if (!value) {
      return null;
    }

    const pattern = /^(?=.*[a-z\u00f1])(?=.*[A-Z\u00d1])(?=.*\d)(?=.*[@$#%&.*])[A-Za-z\d@$#%&.*\u00d1\u00f1]{8,}$/;

    if (!pattern.test(value)) {
      return { passwordInvalid: true };
    }

    return null;
  };
}


