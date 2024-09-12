import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventFormDialogComponent } from './edit-event-form-dialog.component';

describe('EditEventFormDialogComponent', () => {
  let component: EditEventFormDialogComponent;
  let fixture: ComponentFixture<EditEventFormDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditEventFormDialogComponent]
    });
    fixture = TestBed.createComponent(EditEventFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
