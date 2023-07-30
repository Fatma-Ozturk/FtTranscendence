import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectionAuth42Component } from './redirection-auth42.component';

describe('RedirectionAuth42Component', () => {
  let component: RedirectionAuth42Component;
  let fixture: ComponentFixture<RedirectionAuth42Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RedirectionAuth42Component]
    });
    fixture = TestBed.createComponent(RedirectionAuth42Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
