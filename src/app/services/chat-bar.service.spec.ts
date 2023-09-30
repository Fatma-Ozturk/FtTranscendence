import { TestBed } from '@angular/core/testing';

import { ChatBarService } from './chat-bar.service';

describe('ChatBarService', () => {
  let service: ChatBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
