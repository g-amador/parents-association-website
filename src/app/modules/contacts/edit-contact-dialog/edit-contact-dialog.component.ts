import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contact } from '../../../shared/models/contact.model';

@Component({
  selector: 'app-edit-contact-dialog',
  templateUrl: './edit-contact-dialog.component.html',
  styleUrls: ['./edit-contact-dialog.component.scss']
})
export class EditContactDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public contact: Contact
  ) {}

  // Close the dialog and send the updated contact back
  save(): void {
    this.dialogRef.close(this.contact);
  }

  // Close without saving
  cancel(): void {
    this.dialogRef.close(null);
  }
}
