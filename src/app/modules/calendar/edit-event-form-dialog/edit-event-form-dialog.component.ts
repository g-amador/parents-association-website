import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-event-form-dialog',
  templateUrl: './edit-event-form-dialog.component.html',
  styleUrls: ['./edit-event-form-dialog.component.scss']
})
export class EditEventFormDialogComponent implements OnInit {
  editMode = false;
  eventIndex: number | null = null;
  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditEventFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, date: string | null, description: string, events: any[] }
  ) {
    this.eventForm = this.fb.group({
      title: [data.title, Validators.required],
      date: [data.date, Validators.required],
      description: [data.description, Validators.required],
    });

    if (data.events.length > 0) {
      this.editMode = true;
      this.eventIndex = data.events.length - 1; // Default to the last event in the array
      const event = data.events[this.eventIndex];
      this.eventForm.patchValue(event); // Patch the form with existing event data
    }
  }

  ngOnInit(): void {
    // If any additional initialization is needed
  }

  onSave(): void {
    if (this.eventForm.valid) {
      const result = {
        ...this.eventForm.value, // Get all form values
        index: this.editMode ? this.eventIndex : null // Pass index if in edit mode
      };
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCancelEvent(): void {
    this.dialogRef.close({ cancel: true, date: this.data.date, index: this.eventIndex }); // Pass the correct index
  }
}
