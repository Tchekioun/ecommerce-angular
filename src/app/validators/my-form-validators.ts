import { FormControl, ValidationErrors } from '@angular/forms';

export class MyFormValidators {
  static notOnlyWhitespace(control: FormControl): ValidationErrors | null {
    if (control.value != 0 && control.value.trim() === '') {
      return { notOnlyWhitespace: true };
    } else {
      return null;
    }
  }
}
