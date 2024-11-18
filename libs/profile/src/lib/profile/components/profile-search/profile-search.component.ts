import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '@t-talk/core';
import { UserModel } from '@t-talk/shared';
import { TuiLoader } from '@taiga-ui/core';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { debounceTime, Observable } from 'rxjs';

import { ProfileCardComponent } from '../profile-card/profile-card.component';

@Component({
  standalone: true,
  selector: 'lib-profile-search',
  imports: [
    AsyncPipe,
    ProfileCardComponent,
    ReactiveFormsModule,
    TuiInputModule,
    TuiLoader,
    TuiTextfieldControllerModule,
  ],
  templateUrl: './profile-search.component.html',
  styleUrl: './profile-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSearchComponent implements OnInit {
  private readonly userService: UserService = inject(UserService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  protected usersLoading$: Observable<boolean> =
    this.userService.isUsersListLoading;

  protected users$!: Observable<UserModel[]>;
  protected searchControl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
  });

  public ngOnInit(): void {
    this.users$ = this.userService.getAllUsers(this.searchControl.value);

    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(500))
      .subscribe({
        next: (value: string) => {
          this.users$ = this.userService.getAllUsers(value);
        },
      });
  }
}
