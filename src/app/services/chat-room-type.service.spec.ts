import { TestBed } from '@angular/core/testing';

import { ChatRoomTypeService } from './chat-room-type.service';

describe('ChatRoomTypeService', () => {
  let service: ChatRoomTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatRoomTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
