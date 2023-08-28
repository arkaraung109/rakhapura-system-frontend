import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function timeComparisonValidator(firstControl: any, secondControl: any): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let firstValue = control.get(firstControl)?.value;
        let secondValue = control.get(secondControl)?.value;
        let returnObj = { required: false, isEqualToOrGreaterThan: false };

        if (firstValue == '') {
            returnObj.required = true;
        }
        else {
            returnObj.required = false;
            if (secondValue != '') {
                if (firstValue >= secondValue) {
                    returnObj.isEqualToOrGreaterThan = true;
                } else {
                    returnObj.isEqualToOrGreaterThan = false;
                }
            }
        }

        if (!returnObj.required && !returnObj.isEqualToOrGreaterThan) {
            return null;
        }

        return returnObj;
    }
}

