import { AsyncPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { UserService } from '@t-talk/core';
import { CommentModel, UserModel } from '@t-talk/shared';
import { TuiLet } from '@taiga-ui/cdk';
import { TuiAvatar } from '@taiga-ui/kit';
import { filter, Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'lib-post-comment',
  imports: [AsyncPipe, DatePipe, TuiAvatar, TuiLet],
  templateUrl: './post-comment.component.html',
  styleUrl: './post-comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostCommentComponent implements OnInit {
  private readonly userService: UserService = inject(UserService);

  protected user$!: Observable<UserModel>;

  @Input({
    required: true,
  })
  public comment!: CommentModel;

  public ngOnInit(): void {
    this.user$ = this.userService
      .getUserById(this.comment.authorId)
      .pipe(filter(Boolean));
  }
}
