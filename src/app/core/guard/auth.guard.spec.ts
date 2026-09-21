import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService } from '../service/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const authServiceMock = {
    isAuthenticated: jest.fn()
  };

  const routerMock = {
    createUrlTree: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock
        },
        {
          provide: Router,
          useValue: routerMock
        }
      ]
    });
  });

  it('should allow authenticated user', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(
      () => authGuard({} as any, {} as any)
    );

    expect(result).toBe(true);
  });

  it('should redirect unauthenticated user to login', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);

    const urlTree = {};
    routerMock.createUrlTree.mockReturnValue(urlTree);

    const result = TestBed.runInInjectionContext(
      () => authGuard({} as any, {} as any)
    );

    expect(routerMock.createUrlTree)
      .toHaveBeenCalledWith(['/login']);

    expect(result).toBe(urlTree);
  });
});
