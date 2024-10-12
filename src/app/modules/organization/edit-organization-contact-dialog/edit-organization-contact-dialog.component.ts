import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Contact } from '../../../shared/models/contact.model';

@Component({
  selector: 'app-edit-contact-dialog',
  templateUrl: './edit-organization-contact-dialog.component.html',
  styleUrls: ['./edit-organization-contact-dialog.component.scss']
})
export class EditOrganizationContactDialogComponent {
  contact: Contact; // Use the Contact type for better type safety

  /**
   * Constructor that injects the contact data via MAT_DIALOG_DATA and creates a local copy.
   *
   * @param dialogRef Reference to the open dialog.
   * @param data Data injected through MAT_DIALOG_DATA containing the contact information.
   */
  constructor(
    public dialogRef: MatDialogRef<EditOrganizationContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Contact // Use the Contact type for data
  ) {
    this.contact = { ...data }; // Make a copy to avoid direct binding
  }

  /**
   * Closes the dialog without saving the changes.
   */
  onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Saves the updated contact information and closes the dialog.
   */
  onSave(): void {
    this.dialogRef.close(this.contact);
  }

  /**
   * Handles the image change event. Reads the selected file and updates the contact's image.
   *
   * @param event - The file input change event.
   */
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
