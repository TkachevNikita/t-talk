import type {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function lettersOnlyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    const isValid = /^[a-zA-Zа-яА-ЯёЁ]+$/.test(value);

    return isValid ? null : { lettersOnly: true };
  };
}
