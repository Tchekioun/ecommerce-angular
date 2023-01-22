import { FormControl, ValidationErrors } from '@angular/forms';

export class MyFormValidators {
  static notOnlyWhitespace(control: FormControl): ValidationErrors {
    if (control.value != 0 && control.value.trim() === 0) {
      return { notOnlyWhitespace: true };
    } else {
      return { notOnlyWhitespace: false };
    }
  }
}
