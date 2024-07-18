import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayTemsComponent } from './display-tems.component';

describe('DisplayTemsComponent', () => {
  let component: DisplayTemsComponent;
  let fixture: ComponentFixture<DisplayTemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayTemsComponent]
    });
    fixture = TestBed.createComponent(DisplayTemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
