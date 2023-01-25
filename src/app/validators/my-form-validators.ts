import { FormControl, ValidationErrors } from '@angular/forms';

export class MyFormValidators {
  static notOnlyWhitespace(control: FormControl): ValidationErrors | null {
    if (control.value != null && control.value.trim() === 0) {
      return { notOnlyWhitespace: true };
    } else {
      return null;
    }
  }
}
