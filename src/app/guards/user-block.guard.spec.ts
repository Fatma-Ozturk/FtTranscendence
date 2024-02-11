import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { userBlockGuard } from './user-block.guard';

describe('userBlockGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => userBlockGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
