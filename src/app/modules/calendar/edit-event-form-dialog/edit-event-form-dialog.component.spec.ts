import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditEventFormDialogComponent } from './edit-event-form-dialog.component';

describe('EditEventFormDialogComponent', () => {
  let component: EditEventFormDialogComponent;
  let fixture: ComponentFixture<EditEventFormDialogComponent>;
  let mockDialogRef: MatDialogRef<EditEventFormDialogComponent>;
  const mockData = {
    title: 'Test Event',
    date: '2024-10-05',
    description: 'Test Description',
    events: []
  };

  beforeEach(async () => {
    mockDialogRef = {
      close: jasmine.createSpy('close')
    } as any;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [EditEventFormDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditEventFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with data', () => {
    expect(component.eventForm.value).toEqual({
      title: 'Test Event',
      date: '2024-10-05',
      description: 'Test Description'
    });
  });

  it('should save the form data and close the dialog', () => {
    component.onSave();
    expect(mockDialogRef.close).toHaveBeenCalledWith({
      title: 'Test Event',
      date: '2024-10-05',
      description: 'Test Description',
      index: null
    });
  });

  it('should cancel and close the dialog', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should cancel the event and close the dialog with cancel data', () => {
    component.eventIndex = 0; // Set the event index
    component.onCancelEvent();
    expect(mockDialogRef.close).toHaveBeenCalledWith({ cancel: true, date: '2024-10-05', index: 0 });
  });
});
