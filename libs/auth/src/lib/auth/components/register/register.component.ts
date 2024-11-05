import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  errorMatcher,
  Gender,
  lettersOnlyValidator,
  matchPasswordValidator,
} from '@t-talk/shared';
import { TuiDay, TuiValidationError } from '@taiga-ui/cdk';
import {
  TuiButton,
  TuiError,
  TuiIcon,
  TuiLink,
  TuiTextfield,
  TuiTextfieldOptionsDirective,
} from '@taiga-ui/core';
import { TuiBlock, TuiPassword, TuiRadio, TuiStepper } from '@taiga-ui/kit';
import {
  TuiInputDateModule,
  TuiInputModule,
  TuiTextareaModule,
} from '@taiga-ui/legacy';

import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'lib-auth-register',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    TuiBlock,
    TuiButton,
    TuiError,
    TuiIcon,
    TuiInputDateModule,
    TuiInputModule,
    TuiLink,
    TuiPassword,
    TuiRadio,
    TuiStepper,
    TuiTextareaModule,
    TuiTextfield,
    TuiTextfieldOptionsDirective,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
  private readonly authService: AuthService = inject(AuthService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  protected activeStepIndex = 0;
  protected readonly registerForm: FormGroup = new FormGroup({
    firstName: new FormControl<string>('', [
      Validators.required,
      lettersOnlyValidator(),
    ]),
    secondName: new FormControl<string>('', [
      Validators.required,
      lettersOnlyValidator(),
    ]),
    gender: new FormControl<Gender | null>(null, Validators.required),
    birthDate: new FormControl<TuiDay | null>(null, Validators.required),
    email: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
    repeatPassword: new FormControl<string>('', [
      Validators.required,
      matchPasswordValidator,
    ]),
    bio: new FormControl<string>(''),
  });

  public ngOnInit(): void {
    const passwordControl = this.registerForm.controls['password'];
    const repeatPasswordControl = this.registerForm.controls['repeatPassword'];

    repeatPasswordControl.addValidators(
      matchPasswordValidator(passwordControl),
    );
    repeatPasswordControl.updateValueAndValidity();
  }

  protected register(): void {
    this.authService
      .register({
        ...this.registerForm.value,
        birthDate:
          this.registerForm.controls['birthDate'].value.toLocalNativeDate(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  protected nextStep(): void {
    this.activeStepIndex++;
  }

  protected computeError(controlName: string): TuiValidationError | null {
    const control = this.registerForm.controls[controlName];

    return !control.untouched ? errorMatcher(control) : null;
  }
}
