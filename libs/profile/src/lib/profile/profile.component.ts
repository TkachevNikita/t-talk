import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { LikeService, NotificationService, UserService } from '@t-talk/core';
import { UserModel } from '@t-talk/shared';
import { TuiLet, TuiRepeatTimes } from '@taiga-ui/cdk';
import {
  TuiAppearance,
  TuiButton,
  TuiDataList,
  TuiDropdown,
  TuiIcon,
  TuiTitle,
} from '@taiga-ui/core';
import {
  TuiAvatar,
  TuiBadge,
  TuiBadgeNotification,
  TuiChevron,
  TuiDataListDropdownManager,
  TuiFade,
  TuiSwitch,
  TuiTabs,
} from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader, TuiNavigation } from '@taiga-ui/layout';
import { Observable, switchMap, take, tap } from 'rxjs';

import { AuthService } from '../../../../auth/src/lib/auth/services/auth.service';

@Component({
  standalone: true,
  selector: 'lib-profile',
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    TuiAppearance,
    TuiAvatar,
    TuiBadge,
    TuiBadgeNotification,
    TuiButton,
    TuiCardLarge,
    TuiChevron,
    TuiDataList,
    TuiDataListDropdownManager,
    TuiDropdown,
    TuiFade,
    TuiHeader,
    TuiIcon,
    TuiLet,
    TuiNavigation,
    TuiRepeatTimes,
    TuiSwitch,
    TuiTabs,
    TuiTitle,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LikeService, AuthService],
})
export class ProfileComponent implements OnInit {
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly router: Router = inject(Router);
  private readonly userService: UserService = inject(UserService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly notificationService: NotificationService =
    inject(NotificationService);

  protected user$!: Observable<UserModel>;
  protected expanded = false;
  protected open = false;
  protected switch = false;

  public ngOnInit(): void {
    this.user$ = this.userService.currentUser;
    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        if (!this.activatedRoute.firstChild) {
          this.router.navigate([`/profile/${data['userId']}`]);
        }
      });
  }

  public logout(): void {
    this.authService
      .logout()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(async () => this.router.navigate(['/auth'])),
        switchMap(() =>
          this.notificationService
            .success('Выход', 'Вы успешно вышли из системы')
            .pipe(take(1)),
        ),
      )
      .subscribe();
  }
}
