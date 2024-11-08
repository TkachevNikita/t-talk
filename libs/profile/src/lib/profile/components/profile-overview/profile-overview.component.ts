import { AsyncPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { PostService, UserService } from '@t-talk/core';
import { ProfilePostComponent } from '@t-talk/profile';
import { PostModel, UserModel } from '@t-talk/shared';
import { TuiLet } from '@taiga-ui/cdk';
import { TuiButton, TuiIcon, TuiLoader } from '@taiga-ui/core';
import { TuiAvatar, TuiSkeleton } from '@taiga-ui/kit';
import { TuiTextareaModule } from '@taiga-ui/legacy';
import { Timestamp } from 'firebase/firestore';
import { Observable, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'lib-profile-overview',
  imports: [
    AsyncPipe,
    DatePipe,
    ProfilePostComponent,
    ReactiveFormsModule,
    TuiAvatar,
    TuiButton,
    TuiIcon,
    TuiLet,
    TuiLoader,
    TuiSkeleton,
    TuiTextareaModule,
  ],
  templateUrl: './profile-overview.component.html',
  styleUrl: './profile-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PostService],
})
export class ProfileOverviewComponent implements OnInit {
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly userService: UserService = inject(UserService);
  private readonly postService: PostService = inject(PostService);

  protected isCurrentUser = false;
  protected posts$!: Observable<PostModel[]>;
  protected isPostLoading$: Observable<boolean> = this.postService.isLoading;
  protected user$!: Observable<UserModel | null>;
  protected isUserLoading$: Observable<boolean> =
    this.userService.isUserLoading;

  protected postControl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  public ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (params: Params) => {
          this.user$ = this.userService.isCurrentUserProfile(params['id']).pipe(
            switchMap((isCurrentUser: boolean) => {
              this.isCurrentUser = isCurrentUser;
              this.posts$ = this.postService.getPostsByUserId(params['id']);

              return isCurrentUser
                ? this.userService.getUserData()
                : this.userService.getUserById(params['id']);
            }),
          );
        },
      });
  }

  public createPost(authorId: string): void {
    this.posts$ = this.postService.createPost({
      authorId,
      content: this.postControl.value,
      createdAt: Timestamp.now(),
    });
    this.postControl.reset();
  }
}
