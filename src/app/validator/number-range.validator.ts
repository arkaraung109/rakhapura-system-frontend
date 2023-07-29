import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const numberRangeValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if ((control.value > 0 && control.value <= 100) || control.value == '') {
      return null;
    } else {
      return { numberRange: true };
    }
  };
};