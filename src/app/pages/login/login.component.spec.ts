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

  it('should authenticate and store the JWT', () => {
    authServiceMock.login.mockReturnValue(
      of({ token: 'JWT_TOKEN' })
    );

    component.loginForm.setValue({
      login: 'agent',
      password: 'password'
    });

    component.onSubmit();

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

  it('should display an error for invalid credentials', () => {
    authServiceMock.login.mockReturnValue(
      throwError(() => ({ status: 401 }))
    );

    component.loginForm.setValue({
      login: 'agent',
      password: 'wrong-password'
    });

    component.onSubmit();

    expect(component.errorMessage)
      .toBe('Identifiant ou mot de passe incorrect.');

    expect(authServiceMock.storeToken)
      .not.toHaveBeenCalled();
  });

  it('should not call the API when the form is invalid', () => {
    component.loginForm.setValue({
      login: '',
      password: ''
    });

    component.onSubmit();

    expect(authServiceMock.login)
      .not.toHaveBeenCalled();
  });
});
