import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../core/service/auth.service';

import { Router, provideRouter } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let router: Router;
  let fixture: ComponentFixture<LoginComponent>;

  const authServiceMock = {
    login: jest.fn(),
    storeToken: jest.fn(),
    getToken: jest.fn(),
    isAuthenticated: jest.fn(),
    clearToken: jest.fn()
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock
        },
        provideRouter([])
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate')
      .mockResolvedValue(true);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should authenticate, store the JWT and navigate to students', () => {
    // GIVEN: valid credentials and a successful API response.
    authServiceMock.login.mockReturnValue(
      of({ token: 'JWT_TOKEN' })
    );

    component.loginForm.setValue({
      login: 'agent',
      password: 'password'
    });

    // WHEN: the form is submitted.
    component.onSubmit();

    // THEN: the token is stored and the user enters the protected area.
    expect(authServiceMock.login).toHaveBeenCalledWith({
      login: 'agent',
      password: 'password'
    });

    expect(authServiceMock.storeToken)
      .toHaveBeenCalledWith('JWT_TOKEN');

    expect(router.navigate)
      .toHaveBeenCalledWith(['/students']);

    expect(component.errorMessage).toBeNull();
  });

  it('should display a dedicated error for invalid credentials', () => {
    // GIVEN: the backend rejects the credentials.
    authServiceMock.login.mockReturnValue(
      throwError(() => ({ status: 401 }))
    );

    component.loginForm.setValue({
      login: 'agent',
      password: 'wrong-password'
    });

    // WHEN: the form is submitted.
    component.onSubmit();

    // THEN: no token is stored and the explicit authentication error is shown.
    expect(component.errorMessage)
      .toBe('Identifiant ou mot de passe incorrect.');

    expect(authServiceMock.storeToken)
      .not.toHaveBeenCalled();
  });

  it('should display a generic message for another server error', () => {
    // GIVEN: the backend fails with a non-authentication error.
    authServiceMock.login.mockReturnValue(
      throwError(() => ({ status: 500 }))
    );

    component.loginForm.setValue({
      login: 'agent',
      password: 'password'
    });

    // WHEN: the form is submitted.
    component.onSubmit();

    // THEN: the generic error is exposed to the user.
    expect(component.errorMessage)
      .toBe('Une erreur est survenue. Veuillez réessayer.');
  });

  it('should not call the API when the form is invalid', () => {
    // GIVEN: both required fields are empty.
    component.loginForm.setValue({
      login: '',
      password: ''
    });

    // WHEN: submission is attempted.
    component.onSubmit();

    // THEN: no HTTP authentication request is triggered.
    expect(authServiceMock.login)
      .not.toHaveBeenCalled();
  });
});
