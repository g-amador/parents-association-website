import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditOrganizationContactDialogComponent } from './edit-organization-contact-dialog.component';
import { FormsModule } from '@angular/forms';

describe('EditOrganizationContactDialogComponent', () => {
  let component: EditOrganizationContactDialogComponent;
  let fixture: ComponentFixture<EditOrganizationContactDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<EditOrganizationContactDialogComponent>>;

  const mockDialogData = {
    contact: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      image: 'path/to/image.jpg'
    }
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [EditOrganizationContactDialogComponent],
      imports: [FormsModule],  // Needed for [(ngModel)]
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrganizationContactDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize contact with data from MAT_DIALOG_DATA', () => {
    expect(component.contact).toEqual(mockDialogData.contact);
  });

  it('should close dialog without saving on onCancel', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });

  it('should close dialog with updated contact data on onSave', () => {
    component.contact.name = 'Jane Doe';
    component.onSave();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(component.contact);
  });
});
