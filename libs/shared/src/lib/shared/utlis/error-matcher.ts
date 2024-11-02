import type { AbstractControl } from '@angular/forms';
import { TuiValidationError } from '@taiga-ui/cdk';

/**
 * Возвращает ошибку пользовательского ввода
 * @param {AbstractControl} control - контрол для проверки
 * @return {TuiValidationError | null} - валидационная ошибка, если она присутствует, иначе null
 */
export const errorMatcher = (
  control: AbstractControl,
): TuiValidationError | null => {
  if (control.hasError('required')) {
    return new TuiValidationError('Это поле обязательно для заполнения');
  }

  if (control.hasError('min')) {
    const min = control.getError('min').min;

    return new TuiValidationError(`Минимальное значение: ${min}`);
  }

  if (control.hasError('max')) {
    const max = control.getError('max').max;

    return new TuiValidationError(`Максимальное значение: ${max}`);
  }

  if (control.hasError('maxLength')) {
    const maxLength = control.getError('maxlength').requiredLength;

    return new TuiValidationError(`Максимальная длина: ${maxLength} символов`);
  }

  if (control.hasError('lettersOnly')) {
    return new TuiValidationError('Поле может содержать только буквы');
  }

  return null;
};
