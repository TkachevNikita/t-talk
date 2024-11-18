import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TuiDay, TuiValidationError } from '@taiga-ui/cdk';
import { of } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let authServiceMock: jest.Mocked<AuthService>;

  beforeEach(async () => {
    authServiceMock = {
      register: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, RegisterComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    const fixture = TestBed.createComponent(RegisterComponent);

    component = fixture.componentInstance;
  });

  it('компонент должен быть создан', () => {
    expect(component).toBeTruthy();
  });

  it('форма должна быть инициализирована с пустыми значениями', () => {
    expect(component.registerForm.controls['firstName'].value).toBe('');
    expect(component.registerForm.controls['secondName'].value).toBe('');
    expect(component.registerForm.controls['email'].value).toBe('');
    expect(component.registerForm.controls['password'].value).toBe('');
    expect(component.registerForm.controls['repeatPassword'].value).toBe('');
  });

  it('имя должно быть невалидным, если оно пустое', () => {
    const firstNameControl = component.registerForm.controls['firstName'];

    firstNameControl.setValue('');

    expect(firstNameControl.valid).toBeFalsy();
    expect(firstNameControl.errors).toEqual({
      lettersOnly: true,
      required: true,
    });
  });

  it('при вызове метода register, должен быть вызван AuthService.register', () => {
    authServiceMock.register.mockReturnValue(of());

    component.registerForm.setValue({
      firstName: 'John',
      secondName: 'Doe',
      gender: 'Male',
      birthDate: TuiDay.currentLocal(),
      email: 'test@example.com',
      password: 'Password123',
      repeatPassword: 'Password123',
      bio: '',
    });

    component.register();

    expect(authServiceMock.register).toHaveBeenCalledWith({
      firstName: 'John',
      secondName: 'Doe',
      gender: 'Male',
      birthDate: TuiDay.currentLocal().toLocalNativeDate(),
      email: 'test@example.com',
      password: 'Password123',
      bio: '',
    });
  });

  it('нужно инкрементировать activeStepIndex при переходе на следуюущю страницу', () => {
    component.activeStepIndex = 0;
    component.nextStep();

    expect(component.activeStepIndex).toBe(1);
  });

  it('нужно получить ошибку валидации при некорретных данных', () => {
    const firstNameControl = component.registerForm.controls['firstName'];

    firstNameControl.setValue('');
    firstNameControl.markAsTouched();

    const error = component.computeError('firstName');

    expect(error).toBeInstanceOf(TuiValidationError);
  });

  it('если контрол не потроганный, то ошибка равна null', () => {
    const error = component.computeError('firstName');

    expect(error).toBeNull();
  });
});
