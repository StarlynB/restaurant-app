import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainIconComponent } from './main-icon.component';

describe('MainIconComponent', () => {
  let component: MainIconComponent;
  let fixture: ComponentFixture<MainIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainIconComponent]
    });
    fixture = TestBed.createComponent(MainIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
