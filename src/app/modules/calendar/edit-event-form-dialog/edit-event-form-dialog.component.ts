import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-event-form-dialog',
  templateUrl: './edit-event-form-dialog.component.html',
  styleUrls: ['./edit-event-form-dialog.component.scss']
})
export class AddEventFormDialogComponent {
  editMode = false;
  eventIndex: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddEventFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, date: string | null, description: string, events: any[] }
  ) {
    if (data.events.length > 0) {
      this.editMode = true;
      this.eventIndex = data.events.length - 1; // Default to the last event in the array
      const event = data.events[this.eventIndex];
      this.data.title = event.title;
      this.data.description = event.description;
    }
  }

  onSave(): void {
    const result = {
      title: this.data.title,
      date: this.data.date,
      description: this.data.description,
      index: this.eventIndex
    };
    this.dialogRef.close(result);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
