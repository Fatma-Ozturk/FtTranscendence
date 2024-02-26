import { TestBed } from '@angular/core/testing';

import { UserTwoFAService } from './user-two-fa.service';

describe('UserTwoFAService', () => {
  let service: UserTwoFAService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTwoFAService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
