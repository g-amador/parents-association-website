import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrganizationContactDialogComponent } from './edit-organization-contact-dialog.component';

describe('EditContactDialogComponent', () => {
  let component: EditOrganizationContactDialogComponent;
  let fixture: ComponentFixture<EditOrganizationContactDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditOrganizationContactDialogComponent]
    });
    fixture = TestBed.createComponent(EditOrganizationContactDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
