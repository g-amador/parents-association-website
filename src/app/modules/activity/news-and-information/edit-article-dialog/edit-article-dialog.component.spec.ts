import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditArticleDialogComponent } from './edit-article-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

describe('EditArticleDialogComponent', () => {
  let component: EditArticleDialogComponent;
  let fixture: ComponentFixture<EditArticleDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<EditArticleDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [EditArticleDialogComponent],
      imports: [ReactiveFormsModule], // Needed for reactive forms
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { article: { title: 'Test Title', content: 'Test Content' } } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditArticleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with article data if provided', () => {
    // Form should be pre-filled with the provided article data
    expect(component.articleForm.value).toEqual({
      title: 'Test Title',
      content: 'Test Content'
    });
  });

  it('should initialize the form with empty values if no article is provided', () => {
    // Simulate no article provided
    component.data = { article: null };
    component.ngOnInit();

    expect(component.articleForm.value).toEqual({
      title: '',
      content: ''
    });
  });

  it('should close the dialog and return form data on save', () => {
    component.articleForm.setValue({
      title: 'Updated Title',
      content: 'Updated Content'
    });

    component.save();

    // Expect dialog to be closed with the form's value
    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      title: 'Updated Title',
      content: 'Updated Content'
    });
  });

  it('should not close the dialog if the form is invalid', () => {
    component.articleForm.controls['title'].setValue(''); // Make the form invalid
    component.save();

    // Since the form is invalid, dialog should not be closed
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should close the dialog without data on cancel', () => {
    component.cancel();

    // Expect dialog to be closed with no data
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should close the dialog with "delete" on delete', () => {
    component.delete();

    // Expect dialog to be closed with the string 'delete'
    expect(dialogRefSpy.close).toHaveBeenCalledWith('delete');
  });
});
