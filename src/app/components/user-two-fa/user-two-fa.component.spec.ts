import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTwoFAComponent } from './user-two-fa.component';

describe('UserTwoFAComponent', () => {
  let component: UserTwoFAComponent;
  let fixture: ComponentFixture<UserTwoFAComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserTwoFAComponent]
    });
    fixture = TestBed.createComponent(UserTwoFAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
