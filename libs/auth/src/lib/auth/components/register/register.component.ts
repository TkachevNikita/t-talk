import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Gender } from '@t-talk/shared';
import {
  TuiButton,
  TuiLink,
  TuiTextfieldOptionsDirective,
} from '@taiga-ui/core';
import { TuiBlock, TuiRadio } from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/legacy';

@Component({
  standalone: true,
  selector: 'lib-auth-register',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    TuiBlock,
    TuiButton,
    TuiInputModule,
    TuiLink,
    TuiRadio,
    TuiTextfieldOptionsDirective,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  protected readonly registerForm: FormGroup = new FormGroup({
    firstName: new FormControl<string>('', Validators.required),
    secondName: new FormControl<string>('', Validators.required),
    gender: new FormControl<Gender | null>(null, Validators.required),
    email: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
  });
}
