import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const lessThanValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  let passMark = control.get('passMark')?.value;
  let markPercentage = control.get('markPercentage')?.value;

  let returnObj = { requiredPassMarkError: false, requiredMarkPercentageError: false, passMarkRangeError: false, markPercentageRangeError: false, lessThanError: false };

  let isPassMarkNumber = /^\d+$/.test(passMark) && !isNaN(Number(passMark));
  let isMarkPercentageNumber = /^\d+$/.test(markPercentage) && !isNaN(Number(markPercentage));

  if (isPassMarkNumber) {
    if (Number(passMark) < 0 || Number(passMark) > 100) {
      returnObj.passMarkRangeError = true;
    }
  } else {
    returnObj.passMarkRangeError = true;
  }

  if (isMarkPercentageNumber) {
    if (Number(markPercentage) < 0 || Number(markPercentage) > 100) {
      returnObj.markPercentageRangeError = true;
    }
  } else {
    returnObj.markPercentageRangeError = true;
  }

  if (isPassMarkNumber && isMarkPercentageNumber) {
    if (Number(passMark) > Number(markPercentage)) {
      if (!returnObj.passMarkRangeError) {
        returnObj.lessThanError = true;
      }
    }
  }

  if (passMark == '') {
    returnObj.requiredPassMarkError = true;
    returnObj.passMarkRangeError = false;
  }
  if (markPercentage == '') {
    returnObj.requiredMarkPercentageError = true;
    returnObj.markPercentageRangeError = false;
  }

  if (!returnObj.requiredPassMarkError && !returnObj.requiredMarkPercentageError && !returnObj.passMarkRangeError && !returnObj.markPercentageRangeError && !returnObj.lessThanError) {
    return null;
  }

  return returnObj;

};