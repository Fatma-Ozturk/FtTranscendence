import { TestBed } from '@angular/core/testing';

import { ActivePageNameService } from './active-page-name.service';

describe('ActivePageNameService', () => {
  let service: ActivePageNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivePageNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
