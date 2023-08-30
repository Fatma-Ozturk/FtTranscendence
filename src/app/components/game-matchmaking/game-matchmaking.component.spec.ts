import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameMatchmakingComponent } from './game-matchmaking.component';

describe('GameMatchmakingComponent', () => {
  let component: GameMatchmakingComponent;
  let fixture: ComponentFixture<GameMatchmakingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameMatchmakingComponent]
    });
    fixture = TestBed.createComponent(GameMatchmakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
