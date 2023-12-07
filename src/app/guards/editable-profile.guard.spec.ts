import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { editableProfileGuard } from './editable-profile.guard';

describe('editableProfileGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => editableProfileGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
