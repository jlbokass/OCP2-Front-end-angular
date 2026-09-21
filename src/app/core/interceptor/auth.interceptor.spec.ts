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
    authServiceMock.getToken.mockReturnValue('JWT_TOKEN');

    httpClient.get('/api/students').subscribe();

    const request =
      httpTestingController.expectOne('/api/students');

    expect(
      request.request.headers.get('Authorization')
    ).toBe('Bearer JWT_TOKEN');

    request.flush([]);
  });

  it('should not add Bearer token to login request', () => {
    authServiceMock.getToken.mockReturnValue('JWT_TOKEN');

    httpClient.post('/api/login', {}).subscribe();

    const request =
      httpTestingController.expectOne('/api/login');

    expect(
      request.request.headers.has('Authorization')
    ).toBe(false);

    request.flush({});
  });
});
