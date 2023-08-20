import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function confirmPasswordValidator(firstControl: any, secondControl: any): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let firstValue = control.get(firstControl)?.value;
        let secondValue = control.get(secondControl)?.value;
        return firstValue != secondValue ? { notMatch: true } : null;
    }
}