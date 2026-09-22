import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { RegisterComponent } from './register.component';
import { UserService } from '../../core/service/user.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;

  const userServiceMock = {
    register: jest.fn()
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    userServiceMock.register.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock
        },
        provideRouter([])
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate')
      .mockResolvedValue(true);

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call registration when the form is invalid', () => {
    // GIVEN: the required fields are empty.

    // WHEN: submission is attempted.
    component.onSubmit();

    // THEN: the service is not called.
    expect(userServiceMock.register)
      .not.toHaveBeenCalled();

    expect(component.submitted).toBe(true);
  });

  it('should register the form values and navigate to login', () => {
    // GIVEN: a valid registration form.
    component.registerForm.setValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      login: 'ada',
      password: 'password'
    });

    // WHEN: the form is submitted.
    component.onSubmit();

    // THEN: the exact payload is sent and login is displayed next.
    expect(userServiceMock.register)
      .toHaveBeenCalledWith({
        firstName: 'Ada',
        lastName: 'Lovelace',
        login: 'ada',
        password: 'password'
      });

    expect(router.navigate)
      .toHaveBeenCalledWith(['/login']);
  });

  it('should reset the form and submitted state', () => {
    // GIVEN: a previously submitted populated form.
    component.registerForm.setValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      login: 'ada',
      password: 'password'
    });
    component.submitted = true;

    // WHEN: reset is requested.
    component.onReset();

    // THEN: values and submission state are cleared.
    expect(component.submitted).toBe(false);
    expect(component.registerForm.value).toEqual({
      firstName: null,
      lastName: null,
      login: null,
      password: null
    });
  });

  it('should mask the password input', () => {
    // GIVEN: the registration template is rendered.
    const passwordInput =
      fixture.nativeElement.querySelector(
        'input[formControlName="password"]'
      ) as HTMLInputElement;

    // THEN: the browser masks the entered value.
    expect(passwordInput.type).toBe('password');
  });
});
