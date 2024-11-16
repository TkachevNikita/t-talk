import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lib-followers',
  imports: [CommonModule],
  templateUrl: './followers.component.html',
  styleUrl: './followers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowersComponent {}
