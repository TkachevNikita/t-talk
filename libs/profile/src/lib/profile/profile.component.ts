import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { UserService } from '@t-talk/core';
import { TuiRepeatTimes } from '@taiga-ui/cdk';
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
import { EMPTY, switchMap, tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'lib-profile',
  imports: [
    CommonModule,
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
    TuiNavigation,
    TuiRepeatTimes,
    TuiSwitch,
    TuiTabs,
    TuiTitle,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private readonly userService: UserService = inject(UserService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly router: Router = inject(Router);

  protected expanded = true;
  protected open = false;
  protected switch = false;

  public ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((params) => {
          if (params['id']) {
            return this.userService.getUserData();
          }

          return this.userService.getUserData().pipe(
            tap((user) => {
              this.router.navigate([`/profile/${user?.uid}`]);
            }),
            switchMap(() => EMPTY),
          );
        }),
      )
      .subscribe();
  }
}
