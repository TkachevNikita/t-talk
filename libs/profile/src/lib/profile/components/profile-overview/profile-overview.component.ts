import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiAvatar } from '@taiga-ui/kit';

@Component({
  standalone: true,
  selector: 'lib-profile-overview',
  imports: [TuiAvatar],
  templateUrl: './profile-overview.component.html',
  styleUrl: './profile-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileOverviewComponent {}
