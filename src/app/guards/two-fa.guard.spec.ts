import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { twoFAGuard } from './two-fa.guard';

describe('twoFAGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => twoFAGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
