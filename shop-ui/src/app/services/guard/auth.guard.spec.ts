import {TestBed} from '@angular/core/testing';
import {CanActivateFn} from '@angular/router';
import {authGuard} from './auth.guard';

describe('tmpGuard', () => {
  const requiredRole = 'admin';

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(requiredRole)(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
