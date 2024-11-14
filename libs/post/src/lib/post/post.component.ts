import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentService, LikeService, UserService } from '@t-talk/core';
import { CommentModel, PostModel, UserModel } from '@t-talk/shared';
import { TuiLet } from '@taiga-ui/cdk';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiAvatar, TuiLike, TuiTooltip } from '@taiga-ui/kit';
import { TuiInputModule, TuiTextareaModule } from '@taiga-ui/legacy';
import { Timestamp } from 'firebase/firestore';
import { combineLatest, filter, Observable, switchMap } from 'rxjs';

import { PostCommentComponent } from './components/post-comment/post-comment.component';

@Component({
  standalone: true,
  selector: 'lib-post',
  imports: [
    AsyncPipe,
    DatePipe,
    FormsModule,
    JsonPipe,
    PostCommentComponent,
    ReactiveFormsModule,
    TuiAvatar,
    TuiButton,
    TuiIcon,
    TuiInputModule,
    TuiLet,
    TuiLike,
    TuiTextareaModule,
    TuiTextfield,
    TuiTooltip,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('commentsAnimation', [
      state(
        'hidden',
        style({
          opacity: 0,
          height: '0px',
          overflow: 'hidden',
        }),
      ),
      state(
        'visible',
        style({
          opacity: 1,
          height: '*',
        }),
      ),
      transition('hidden <=> visible', [animate('0.3s ease-in-out')]),
    ]),
  ],
})
export class PostComponent implements OnInit {
  private readonly userService: UserService = inject(UserService);
  private readonly likeService: LikeService = inject(LikeService);
  private readonly commentService: CommentService = inject(CommentService);
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

  @Output()
  public readonly removePost: EventEmitter<PostModel> =
    new EventEmitter<PostModel>();

  public user$!: Observable<UserModel>;
  public author$!: Observable<UserModel>;
  public liked$!: Observable<boolean>;
  public comments$!: Observable<CommentModel[]>;

  public ngOnInit(): void {
    this.user$ = this.userService.currentUser;
    this.comments$ = this.commentService
      .getComments(this.post.id!)
      .pipe(filter(Boolean));
    this.author$ = this.userService
      .getUserById(this.post.authorId)
      .pipe(filter(Boolean));
    this.liked$ = this.user$.pipe(
      takeUntilDestroyed(this.destroyRef),
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
    this.likeControl.disable();

    combineLatest([this.user$, this.liked$])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(([user, liked]) => {
          if (liked) {
            this.post.likesCount--;

            return this.likeService.removeLike(this.post.id!, user.uid!);
          }

          this.post.likesCount++;

          return this.likeService.setLike(this.post.id!, user.uid!);
        }),
      )
      .subscribe({
        next: () => this.likeControl.enable(),
      });
  }

  public addComment(): void {
    this.commentControl.disable();

    this.user$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((user) =>
          this.commentService.addComment({
            authorId: user.uid!,
            content: this.commentControl.value,
            createdAt: Timestamp.now(),
            postId: this.post.id!,
          }),
        ),
      )
      .subscribe({
        next: () => {
          this.commentControl.reset();
          this.commentControl.enable();
        },
      });
  }

  public deletePost(post: PostModel): void {
    this.removePost.emit(post);
  }
}
