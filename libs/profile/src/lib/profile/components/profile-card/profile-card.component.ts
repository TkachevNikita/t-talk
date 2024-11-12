import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from '@t-talk/shared';
import { TuiButton, TuiLink } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';

@Component({
  standalone: true,
  selector: 'lib-profile-card',
  imports: [TuiAvatar, TuiButton, TuiLink],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCardComponent {
  private readonly router: Router = inject(Router);

  @Input({
    required: true,
  })
  public user!: UserModel;

  public openProfile(): void {
    this.router.navigateByUrl(`/profile/${this.user.uid}`);
  }
}
