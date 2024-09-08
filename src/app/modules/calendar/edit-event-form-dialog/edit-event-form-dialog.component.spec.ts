import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventFormDialogComponent } from './edit-event-form-dialog.component';

describe('AddEventFormDialogComponent', () => {
  let component: AddEventFormDialogComponent;
  let fixture: ComponentFixture<AddEventFormDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEventFormDialogComponent]
    });
    fixture = TestBed.createComponent(AddEventFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
