import { TestBed } from '@angular/core/testing';

import { AchievementRuleService } from './achievement-rule.service';

describe('AchievementRuleService', () => {
  let service: AchievementRuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AchievementRuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
