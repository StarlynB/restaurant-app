import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartersIconComponent } from './starters-icon.component';

describe('StartersIconComponent', () => {
  let component: StartersIconComponent;
  let fixture: ComponentFixture<StartersIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StartersIconComponent]
    });
    fixture = TestBed.createComponent(StartersIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
