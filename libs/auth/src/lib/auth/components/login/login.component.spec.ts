import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authServiceMock: jest.Mocked<AuthService>;

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, LoginComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);

    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with empty values', () => {
    expect(component.loginForm.controls.email.value).toBe('');
    expect(component.loginForm.controls.password.value).toBe('');
  });

  it('should mark email as invalid if empty', () => {
    const emailControl = component.loginForm.controls.email;

    emailControl.setValue('');

    expect(emailControl.valid).toBeFalsy();
  });

  it('should call authService.login on login with form values', () => {
    const email = 'test@example.com';
    const password = 'password123';

    authServiceMock.login.mockReturnValue(of({} as any));

    component.loginForm.setValue({ email, password });
    component.login();

    expect(authServiceMock.login).toHaveBeenCalledWith(email, password);
  });
});
