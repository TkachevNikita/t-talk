import { AsyncPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LikeService, PostService, UserService } from '@t-talk/core';
import { PostModel, UserModel } from '@t-talk/shared';
import { TuiLet } from '@taiga-ui/cdk';
import { TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiAvatar, TuiLike } from '@taiga-ui/kit';
import { TuiInputModule, TuiTextareaModule } from '@taiga-ui/legacy';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'lib-profile-post',
  imports: [
    AsyncPipe,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    TuiAvatar,
    TuiIcon,
    TuiInputModule,
    TuiLet,
    TuiLike,
    TuiTextareaModule,
    TuiTextfield,
  ],
  templateUrl: './profile-post.component.html',
  styleUrl: './profile-post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LikeService],
})
export class ProfilePostComponent implements OnInit {
  private readonly userService: UserService = inject(UserService);
  private readonly likeService: LikeService = inject(LikeService);
  private readonly postService: PostService = inject(PostService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  protected commentControl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
  });

  protected likeControl: FormControl<boolean> = new FormControl<boolean>(
    false,
    {
      nonNullable: true,
    },
  );

  @Input({
    required: true,
  })
  public post!: PostModel;

  public user$!: Observable<UserModel>;
  public liked$!: Observable<boolean>;

  public ngOnInit(): void {
    this.user$ = this.userService
      .getUserById(this.post.authorId)
      .pipe(filter(Boolean));

    this.liked$ = this.userService.getUserData().pipe(
      filter(Boolean),
      switchMap((user: UserModel) =>
        this.likeService.isLikeByUser(this.post.id!, user.uid!),
      ),
    );

    this.liked$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (liked: boolean) => {
        this.likeControl.setValue(liked);
      },
    });
  }

  public setLike(): void {
    combineLatest([this.user$, this.liked$])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.likeControl.disable()),
        switchMap(([user, liked]) => {
          if (liked) {
            this.post.likesCount--;

            return this.likeService.removeLike(this.post.id!, user.uid!);
          }

          this.post.likesCount++;

          return this.likeService.setLike(this.post.id!, user.uid!);
        }),
        switchMap(() => this.postService.getPosts(this.post.authorId)),
      )
      .subscribe({
        next: () => this.likeControl.enable(),
      });
  }
}
