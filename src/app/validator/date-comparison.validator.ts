import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function dateComparisonValidator(firstControl: any, secondControl: any): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let firstValue = control.get(firstControl)?.value;
        let secondValue = control.get(secondControl)?.value;
        let returnObj = { required: false, isGreaterThan: false };

        if (firstValue == '') {
            returnObj.required = true;
        }
        else {
            returnObj.required = false;
            if (secondValue != '') {
                if (firstValue > secondValue) {
                    returnObj.isGreaterThan = true;
                } else {
                    returnObj.isGreaterThan = false;
                }
            }
        }

        if (!returnObj.required && !returnObj.isGreaterThan) {
            return null;
        }

        return returnObj;
    }
}

