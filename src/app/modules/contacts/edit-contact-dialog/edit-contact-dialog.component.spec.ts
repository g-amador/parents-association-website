import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditContactDialogComponent } from './edit-contact-dialog.component';
import { Contact } from '../../../shared/models/contact.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EditContactDialogComponent', () => {
  let component: EditContactDialogComponent;
  let fixture: ComponentFixture<EditContactDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<EditContactDialogComponent>>;
  const mockContact: Contact = {
    role: 'developer',
    name: 'John Doe',
    email: 'john@example.com'
  };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [EditContactDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockContact }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Ignore unknown elements
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContactDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should save and close the dialog with updated contact', () => {
    component.save();
    expect(mockDialogRef.close).toHaveBeenCalledWith(mockContact);
  });

  it('should cancel and close the dialog without saving', () => {
    component.cancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(null);
  });
});
