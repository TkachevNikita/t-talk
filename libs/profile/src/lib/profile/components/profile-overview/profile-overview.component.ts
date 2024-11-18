import { AsyncPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { CommentService, PostService, UserService } from '@t-talk/core';
import { PostComponent } from '@t-talk/post';
import { ProfileComponent } from '@t-talk/profile';
import { PostModel, UserModel } from '@t-talk/shared';
import { TuiLet } from '@taiga-ui/cdk';
import {
  TuiButton,
  TuiDialog,
  TuiIcon,
  TuiLink,
  TuiLoader,
} from '@taiga-ui/core';
import { TuiAvatar, TuiSkeleton } from '@taiga-ui/kit';
import { TuiInputModule, TuiTextareaModule } from '@taiga-ui/legacy';
import { Timestamp } from 'firebase/firestore';
import { Observable, switchMap } from 'rxjs';

import { FollowerService } from '../../../../../../core/src/lib/services/follower.service';
import { ProfileCardComponent } from '../profile-card/profile-card.component';

@Component({
  standalone: true,
  selector: 'lib-profile-overview',
  imports: [
    AsyncPipe,
    DatePipe,
    PostComponent,
    ProfileCardComponent,
    ProfileComponent,
    ReactiveFormsModule,
    RouterLink,
    TuiAvatar,
    TuiButton,
    TuiDialog,
    TuiIcon,
    TuiInputModule,
    TuiLet,
    TuiLink,
    TuiLoader,
    TuiSkeleton,
    TuiTextareaModule,
  ],
  templateUrl: './profile-overview.component.html',
  styleUrl: './profile-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PostService, CommentService],
})
export class ProfileOverviewComponent implements OnInit {
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly userService: UserService = inject(UserService);
  private readonly postService: PostService = inject(PostService);
  private readonly followerService: FollowerService = inject(FollowerService);

  protected followersOpen = false;
  protected followingOpen = false;
  protected isCurrentUser = false;
  protected posts$!: Observable<PostModel[]>;
  protected user$!: Observable<UserModel | null>;
  protected followers$!: Observable<UserModel[]>;
  protected followings$!: Observable<UserModel[]>;
  protected isUserLoading$: Observable<boolean> =
    this.userService.isUserLoading;

  protected postControl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
  });

  public ngOnInit(): void {
    this.user$ = this.activatedRoute.params.pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap((params: Params) => {
        this.posts$ = this.postService.getPosts(params['id']);
        this.followers$ = this.followerService.getFollowers(params['id']);
        this.followings$ = this.followerService.getFollowing(params['id']);

        return this.userService.isCurrentUserProfile(params['id']).pipe(
          switchMap((isCurrentUser: boolean) => {
            this.isCurrentUser = isCurrentUser;

            return isCurrentUser
              ? this.userService.currentUser
              : this.userService.getUserById(params['id']);
          }),
        );
      }),
    );
  }

  public createPost(authorId: string): void {
    this.postService
      .createPost({
        authorId,
        content: this.postControl.value,
        createdAt: Timestamp.now(),
        likesCount: 0,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.postControl.reset(),
      });
  }

  public openFollowers(): void {
    this.followersOpen = true;
  }

  public openFollowing(): void {
    this.followingOpen = true;
  }

  public removePost(post: PostModel): void {
    this.postService
      .deletePost(post)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
