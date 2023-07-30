import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectionAuthGoogleComponent } from './redirection-auth-google.component';

describe('RedirectionAuthGoogleComponent', () => {
  let component: RedirectionAuthGoogleComponent;
  let fixture: ComponentFixture<RedirectionAuthGoogleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RedirectionAuthGoogleComponent]
    });
    fixture = TestBed.createComponent(RedirectionAuthGoogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
