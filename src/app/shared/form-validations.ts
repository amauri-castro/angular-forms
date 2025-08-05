import { AbstractControl, FormArray, ValidatorFn } from "@angular/forms";

export class FormValidations {

    static requiredMinCheckbox(min = 1) {
    const validator: ValidatorFn = (formArray: AbstractControl) => {
      if (formArray instanceof FormArray) {
        const totalChecked = formArray.controls
          .map(v => v.value)
          .reduce((total, current) => current ? total + current : total, 0);
        return totalChecked >= min ? null : { required: true };
      }
      throw new Error('formArray is not a instance of FormArray');
    };
    return validator;
  }
}