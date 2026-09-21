import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { Login } from '../models/Login';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);

    sessionStorage.clear();
  });

  afterEach(() => {
    httpTestingController.verify();
    sessionStorage.clear();
  });

  it('should call POST /api/login and return the token', () => {
    const credentials: Login = {
      login: 'agent',
      password: 'password'
    };

    service.login(credentials).subscribe(response => {
      expect(response.token).toBe('JWT_TOKEN');
    });

    const request = httpTestingController.expectOne('/api/login');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(credentials);

    request.flush({
      token: 'JWT_TOKEN'
    });
  });

  it('should store and retrieve the token', () => {
    service.storeToken('JWT_TOKEN');

    expect(service.getToken()).toBe('JWT_TOKEN');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should clear the token', () => {
    service.storeToken('JWT_TOKEN');

    service.clearToken();

    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});
