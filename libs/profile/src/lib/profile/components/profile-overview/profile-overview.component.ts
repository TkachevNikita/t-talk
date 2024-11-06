import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { UserService } from '@t-talk/core';
import { UserModel } from '@t-talk/shared';
import { TuiLet } from '@taiga-ui/cdk';
import { TuiAvatar } from '@taiga-ui/kit';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'lib-profile-overview',
  imports: [AsyncPipe, TuiAvatar, TuiLet],
  templateUrl: './profile-overview.component.html',
  styleUrl: './profile-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileOverviewComponent implements OnInit {
  private readonly userService: UserService = inject(UserService);

  protected user$!: Observable<UserModel | null>;

  public ngOnInit(): void {
    this.user$ = this.userService.getUserData();
  }
}
