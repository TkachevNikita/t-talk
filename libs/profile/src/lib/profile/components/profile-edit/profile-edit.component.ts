import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService, UserService } from '@t-talk/core';
import {
  errorMatcher,
  Gender,
  IUser,
  lettersOnlyValidator,
  UserModel,
} from '@t-talk/shared';
import { TuiDay, TuiLet, TuiValidationError } from '@taiga-ui/cdk';
import {
  TuiButton,
  TuiError,
  TuiIcon,
  TuiLink,
  TuiTextfield,
} from '@taiga-ui/core';
import {
  TuiAvatar,
  TuiBlock,
  TuiFileLike,
  TuiFiles,
  TuiInputFiles,
  TuiRadioComponent,
} from '@taiga-ui/kit';
import {
  TuiInputDateModule,
  TuiInputModule,
  TuiTextareaModule,
} from '@taiga-ui/legacy';
import { catchError, filter, Observable, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'lib-profile-edit',
  imports: [
    AsyncPipe,
    NgIf,
    ReactiveFormsModule,
    TuiAvatar,
    TuiBlock,
    TuiButton,
    TuiError,
    TuiFiles,
    TuiIcon,
    TuiInputDateModule,
    TuiInputModule,
    TuiLet,
    TuiLink,
    TuiRadioComponent,
    TuiTextareaModule,
    TuiTextfield,
  ],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiInputFiles],
})
export class ProfileEditComponent implements OnInit {
  private readonly userService: UserService = inject(UserService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly notificationService: NotificationService =
    inject(NotificationService);

  protected user$!: Observable<UserModel>;
  protected isLoading$: Observable<boolean> = this.userService.isUserLoading;
  protected readonly profileForm: FormGroup = new FormGroup({
    avatar: new FormControl<TuiFileLike | null>(null),
    firstName: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(2),
      lettersOnlyValidator(),
    ]),
    secondName: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(2),
      lettersOnlyValidator(),
    ]),
    gender: new FormControl<Gender | null>(null, Validators.required),
    birthDate: new FormControl<TuiDay | null>(null, Validators.required),
    bio: new FormControl<string>(''),
  });

  protected newPicture: string | null = null;

  public ngOnInit(): void {
    this.user$ = this.userService.currentUser;

    this.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          ...user,
          birthDate: new TuiDay(
            user.birthDate?.getUTCFullYear() as number,
            user.birthDate?.getMonth() as number,
            user.birthDate?.getDay() as number,
          ),
        });
      },
    });

    this.profileForm.controls['avatar'].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), filter(Boolean))
      .subscribe({
        next: (file: File) => {
          const reader = new FileReader();

          reader.onload = () => {
            this.newPicture = reader.result as string;
            this.cdr.markForCheck();
          };

          reader.readAsDataURL(file);
        },
      });
  }

  protected updateUser(): void {
    this.user$
      .pipe(
        switchMap((user) => {
          const avatar = this.profileForm.controls['avatar'].value;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars,sonarjs/sonar-no-unused-vars
          const { avatar: _, ...profileFormValue } = this.profileForm.value;

          const profileData: Partial<IUser> = {
            ...profileFormValue,
            birthDate: new Date(this.profileForm.controls['birthDate'].value),
          };

          if (avatar) {
            return this.userService
              .updateUserProfilePicture(user.uid!, avatar)
              .pipe(
                switchMap(() =>
                  this.userService.updateUser(user.uid!, profileData),
                ),
              );
          }

          return this.userService.updateUser(user.uid!, profileData);
        }),
        switchMap(() =>
          this.notificationService.success(
            'Обновление профиля',
            'Профиль успешно обновлен',
          ),
        ),
        catchError(() =>
          this.notificationService.error(
            'Обновление профиля',
            'При обновлении профиля произошла ошибка',
          ),
        ),
      )
      .subscribe();
  }

  protected computeError(controlName: string): TuiValidationError | null {
    const control = this.profileForm.controls[controlName];

    return !control.untouched ? errorMatcher(control) : null;
  }
}
