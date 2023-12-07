import { TestBed } from '@angular/core/testing';

import { ChatRoomAuthService } from './chat-room-auth.service';

describe('ChatRoomAuthService', () => {
  let service: ChatRoomAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatRoomAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
