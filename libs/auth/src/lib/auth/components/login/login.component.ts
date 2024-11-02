import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon, TuiLink, TuiTextfield } from '@taiga-ui/core';
import { TuiChip, TuiComment, TuiPassword } from '@taiga-ui/kit';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';

import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'lib-auth-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TuiButton,
    TuiChip,
    TuiComment,
    TuiIcon,
    TuiInputModule,
    TuiLink,
    TuiPassword,
    TuiTextfield,
    TuiTextfieldControllerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authService: AuthService = inject(AuthService);

  protected readonly loginForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
  });

  protected login(): void {
    this.authService
      .login(
        this.loginForm.controls.email.value!,
        this.loginForm.controls.password.value!,
      )
      .subscribe();
  }
}
