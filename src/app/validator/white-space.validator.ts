import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const whiteSpaceValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const regexp = /^[^\s].*$/;
    const linebreak = /^[^\n].*$/;
    if (control.value == '') {
      return null;
    }
    if (linebreak.test(control.value)) {
      if (regexp.test(control.value)) {
        return null;
      } else {
        return { startingWithWhiteSpace: true };
      }
    } else {
      return { linebreak: true };
    }
  };
};