import {AbstractControl} from "@angular/forms"


export const matchValidator = (field: string, fieldConf: string) => {

    return (from: AbstractControl) => {
        const fieldConfControl = from.get(fieldConf);
        const fieldControl = from.get(field);

        if (!fieldConfControl || !fieldControl) {
            return;
        }

        if (fieldControl.errors && !fieldControl.errors['matchValidator']) {
            return;
        }

        const fieldVal = fieldControl?.value;
        const fieldConfVal = fieldConfControl?.value;

        if (fieldVal !== fieldConfVal) {
            fieldConfControl.setErrors({ matchValidator: true });
            return
        }

        fieldConfControl.setErrors(null);
    }

}


