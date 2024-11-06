import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { UserService } from '@t-talk/core';
import { UserModel } from '@t-talk/shared';
import { TuiLet } from '@taiga-ui/cdk';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiAvatar, TuiSkeleton } from '@taiga-ui/kit';
import { TuiTextareaModule } from '@taiga-ui/legacy';
import { Observable, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'lib-profile-overview',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    TuiAvatar,
    TuiButton,
    TuiIcon,
    TuiLet,
    TuiSkeleton,
    TuiTextareaModule,
  ],
  templateUrl: './profile-overview.component.html',
  styleUrl: './profile-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileOverviewComponent implements OnInit {
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly userService: UserService = inject(UserService);

  protected isCurrentUser = false;
  protected user$!: Observable<UserModel | null>;
  protected isUserLoading$: Observable<boolean> =
    this.userService.isUserLoading;

  protected postControl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
  });

  public ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (params: Params) => {
          this.user$ = this.userService.isCurrentUserProfile(params['id']).pipe(
            switchMap((isCurrentUser: boolean) => {
              this.isCurrentUser = isCurrentUser;

              return isCurrentUser
                ? this.userService.getUserData()
                : this.userService.getUserById(params['id']);
            }),
          );
        },
      });
  }
}
