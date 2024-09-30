import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-contact-dialog',
  templateUrl: './edit-organization-contact-dialog.component.html',
  styleUrls: ['./edit-organization-contact-dialog.component.scss']
})
export class EditOrganizationContactDialogComponent {
  contact: any;

  constructor(
    public dialogRef: MatDialogRef<EditOrganizationContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.contact = { ...data.contact }; // Make a copy to avoid direct binding
  }

  // Close the dialog without saving
  onCancel(): void {
    this.dialogRef.close();
  }

  // Save the changes and close the dialog
  onSave(): void {
    this.dialogRef.close(this.contact);
  }

  // Handle file input change for image
  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.contact.image = e.target.result; // Update the contact image
      };
      reader.readAsDataURL(file);
    }
  }
}
