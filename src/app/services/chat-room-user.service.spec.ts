import { TestBed } from '@angular/core/testing';

import { ChatRoomUserService } from './chat-room-user.service';

describe('ChatRoomUserService', () => {
  let service: ChatRoomUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatRoomUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
