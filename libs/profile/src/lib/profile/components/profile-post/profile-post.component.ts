import { AsyncPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '@t-talk/core';
import { PostModel, UserModel } from '@t-talk/shared';
import { TuiLet } from '@taiga-ui/cdk';
import { TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiAvatar, TuiLike } from '@taiga-ui/kit';
import { TuiInputModule, TuiTextareaModule } from '@taiga-ui/legacy';
import { Observable } from 'rxjs';

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
})
export class ProfilePostComponent implements OnInit {
  private readonly userService: UserService = inject(UserService);

  protected user$!: Observable<UserModel | null>;
  protected liked = false;
  protected commentControl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
  });

  @Input({
    required: true,
  })
  public post!: PostModel;

  public ngOnInit(): void {
    this.user$ = this.userService.getUserById(this.post.authorId);
  }
}
