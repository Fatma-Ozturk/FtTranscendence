import { TestBed } from '@angular/core/testing';

import { GameTotalScoreService } from './game-total-score.service';

describe('GameTotalScoreService', () => {
  let service: GameTotalScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameTotalScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
