import { TestBed } from '@angular/core/testing';

import { GameResultNameService } from './game-result-name.service';

describe('GameResultNameService', () => {
  let service: GameResultNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameResultNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
