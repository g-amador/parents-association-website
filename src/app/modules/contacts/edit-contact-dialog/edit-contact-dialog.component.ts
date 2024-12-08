import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contact } from '../../../shared/models/contact.model';

@Component({
  selector: 'app-edit-contact-dialog',
  templateUrl: './edit-contact-dialog.component.html',
  styleUrls: ['./edit-contact-dialog.component.scss']
})
export class EditContactDialogComponent {

  /**
   * Constructor for the EditContactDialogComponent.
   *
   * @param dialogRef - Reference to the dialog that controls its behavior (open/close).
   * @param contact - The contact data being passed in to be edited.
   */
  constructor(
    public dialogRef: MatDialogRef<EditContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public contact: Contact
  ) { }

  /**
   * Save the contact changes and close the dialog.
   * This method sends the updated contact data back to the caller.
   */
  save(): void {
    this.dialogRef.close(this.contact);
  }

  /**
   * Cancel the operation and close the dialog without saving changes.
   * Sends `null` to indicate no changes were made.
   */
  cancel(): void {
    this.dialogRef.close(null);
  }
}
