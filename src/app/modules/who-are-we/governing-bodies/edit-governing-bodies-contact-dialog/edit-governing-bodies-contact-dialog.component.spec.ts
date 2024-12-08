import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditGoverningBodiesContactDialogComponent } from './edit-governing-bodies-contact-dialog.component';
import { FormsModule } from '@angular/forms';

describe('EditGoverningBodiesContactDialogComponent', () => {
  let component: EditGoverningBodiesContactDialogComponent;
  let fixture: ComponentFixture<EditGoverningBodiesContactDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<EditGoverningBodiesContactDialogComponent>>;

  const mockDialogData = {
    contact: {
      role: 'God',
      name: 'John Doe',
      image: 'path/to/image.jpg'
    }
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [EditGoverningBodiesContactDialogComponent],
      imports: [FormsModule],  // Needed for [(ngModel)]
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGoverningBodiesContactDialogComponent);
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
