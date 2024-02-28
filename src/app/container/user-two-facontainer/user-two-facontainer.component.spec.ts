import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTwoFAContainerComponent } from './user-two-facontainer.component';

describe('UserTwoFAContainerComponent', () => {
  let component: UserTwoFAContainerComponent;
  let fixture: ComponentFixture<UserTwoFAContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserTwoFAContainerComponent]
    });
    fixture = TestBed.createComponent(UserTwoFAContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
