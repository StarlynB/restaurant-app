import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditTemsComponent } from './add-or-edit-tems.component';

describe('AddOrEditTemsComponent', () => {
  let component: AddOrEditTemsComponent;
  let fixture: ComponentFixture<AddOrEditTemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddOrEditTemsComponent]
    });
    fixture = TestBed.createComponent(AddOrEditTemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
