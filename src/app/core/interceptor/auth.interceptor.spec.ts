import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { AuthService } from '../service/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const authServiceMock = {
    getToken: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([authInterceptor])
        ),
        provideHttpClientTesting(),
        {
          provide: AuthService,
          useValue: authServiceMock
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController =
      TestBed.inject(HttpTestingController);

    jest.clearAllMocks();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should add Bearer token to student API requests', () => {
    // GIVEN: an authenticated session.
    authServiceMock.getToken.mockReturnValue('JWT_TOKEN');

    // WHEN: a protected student request is sent.
    httpClient.get('/api/students').subscribe();

    // THEN: the interceptor adds the Bearer token.
    const request =
      httpTestingController.expectOne('/api/students');

    expect(
      request.request.headers.get('Authorization')
    ).toBe('Bearer JWT_TOKEN');

    request.flush([]);
  });

  it('should not add Bearer token to login request', () => {
    // GIVEN: a token exists but the endpoint is public.
    authServiceMock.getToken.mockReturnValue('JWT_TOKEN');

    // WHEN: login is called.
    httpClient.post('/api/login', {}).subscribe();

    // THEN: no Authorization header is added.
    const request =
      httpTestingController.expectOne('/api/login');

    expect(
      request.request.headers.has('Authorization')
    ).toBe(false);

    request.flush({});
  });

  it('should not add Bearer token when no token exists', () => {
    // GIVEN: no authenticated session.
    authServiceMock.getToken.mockReturnValue(null);

    // WHEN: a student API request is made.
    httpClient.get('/api/students').subscribe();

    // THEN: the request remains unauthenticated.
    const request =
      httpTestingController.expectOne('/api/students');

    expect(
      request.request.headers.has('Authorization')
    ).toBe(false);

    request.flush([]);
  });
});
