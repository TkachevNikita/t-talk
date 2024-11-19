import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { UserService } from '@t-talk/core';
import { UserModel } from '@t-talk/shared';
import { TuiLet } from '@taiga-ui/cdk';
import { TuiButton, TuiLink } from '@taiga-ui/core';
import { TuiAvatar, TuiSkeleton } from '@taiga-ui/kit';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';

import { FollowerService } from '../../../../../../core/src/lib/services/follower.service';

@Component({
  standalone: true,
  selector: 'lib-profile-card',
  imports: [AsyncPipe, TuiAvatar, TuiButton, TuiLet, TuiLink, TuiSkeleton],
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCardComponent implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly followerService: FollowerService = inject(FollowerService);
  private readonly userService: UserService = inject(UserService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public readonly currentUser$: Observable<UserModel> =
    this.userService.currentUser$;

  public readonly followingsLoading$: Observable<boolean> =
    this.followerService.currentFollowersLoading;

  @Input({ required: true })
  public user!: UserModel;

  public isFollowing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );

  public ngOnInit(): void {
    this.checkFollowingStatus();
  }

  public openProfile(): void {
    this.router.navigateByUrl(`/profile/${this.user.uid}`);
  }

  public toggleFollow(): void {
    this.currentUser$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((currentUser) => {
          if (this.isFollowing$.value) {
            this.isFollowing$.next(false);

            return this.followerService.unfollowUser(
              currentUser.uid!,
              this.user.uid!,
            );
          }

          this.isFollowing$.next(true);

          return this.followerService.followUser(
            currentUser.uid!,
            this.user.uid!,
          );
        }),
      )
      .subscribe();
  }

  private checkFollowingStatus(): void {
    this.followerService
      .getCurrentUsingFollowings()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((following) =>
          of(following.some((user) => user.uid === this.user.uid)),
        ),
      )
      .subscribe((isFollowing) => {
        this.isFollowing$.next(isFollowing);
      });
  }
}
