import type {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function matchPasswordValidator(
  passwordControl: AbstractControl,
): ValidatorFn {
  return (repeatPasswordControl: AbstractControl): ValidationErrors | null => {
    const password = passwordControl.value;
    const repeatPassword = repeatPasswordControl.value;

    return password === repeatPassword ? null : { passwordsMismatch: true };
  };
}
