import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Auth42Component } from './auth42.component';

describe('Auth42Component', () => {
  let component: Auth42Component;
  let fixture: ComponentFixture<Auth42Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Auth42Component]
    });
    fixture = TestBed.createComponent(Auth42Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
