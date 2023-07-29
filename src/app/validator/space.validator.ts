import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const spaceValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const regexp = /^\s*[^\s]*$/;
    if (control.value == '') {
      return null;
    }
    return regexp.test(control.value) ? null : { containSpace: true };
  };
};
