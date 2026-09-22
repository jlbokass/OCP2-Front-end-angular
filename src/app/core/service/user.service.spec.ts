import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { UserService } from './user.service';
import { Register } from '../models/Register';

describe('UserService', () => {
  let service: UserService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should POST the registration payload to /api/register', () => {
    // GIVEN: a complete registration payload.
    const user: Register = {
      firstName: 'Ada',
      lastName: 'Lovelace',
      login: 'ada',
      password: 'password'
    };

    // WHEN: registration is requested.
    service.register(user).subscribe(response => {
      expect(response).toEqual({});
    });

    // THEN: the service sends the expected HTTP request.
    const request = http.expectOne('/api/register');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(user);

    request.flush({});
  });
});
