import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const maxMarkValidator = (maxMark: number): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        let controlValue = control.value;
        let isControlValueNumber = /^\d+$/.test(controlValue) && !isNaN(Number(controlValue));

        if(controlValue == '') {
            return null;
        }

        if (!isControlValueNumber) {
            return { rangeError: true };
        }

        if ((Number(controlValue) >= 0 && Number(controlValue) <= maxMark)) {
            return null;
        } else {
            return { rangeError: true };
        }
    };
};