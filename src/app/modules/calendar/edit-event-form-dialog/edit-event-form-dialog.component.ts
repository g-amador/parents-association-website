import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-event-form-dialog',
  templateUrl: './edit-event-form-dialog.component.html',
  styleUrls: ['./edit-event-form-dialog.component.scss']
})
export class EditEventFormDialogComponent implements OnInit {
  editMode = false; // Flag to indicate whether the form is in "edit" mode (if editing an existing event)
  eventIndex: number | null = null; // Holds the index of the event being edited (if any)
  eventForm: FormGroup; // Reactive form group to handle the event's title, date, and description

  /**
   * Constructor for EditEventFormDialogComponent.
   * @param fb - The FormBuilder service used to construct the reactive form.
   * @param dialogRef - Reference to the dialog, used to control opening/closing of the dialog.
   * @param data - Data passed into the dialog, including event details and event list.
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditEventFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, date: string | null, description: string, events: any[] }
  ) {
    // Initialize the form with validators for each field (title, date, and description)
    this.eventForm = this.fb.group({
      title: [data.title, Validators.required], // Title is required
      date: [data.date, Validators.required], // Date is required
      description: [data.description, Validators.required], // Description is required
    });

    // If there are existing events, switch to edit mode and load the latest event's details into the form
    if (data.events.length > 0) {
      this.editMode = true; // Enable edit mode since there are events to edit
      this.eventIndex = data.events.length - 1; // Default to the last event in the list
      const event = data.events[this.eventIndex]; // Get the event data by index
      this.eventForm.patchValue(event); // Patch the form with the event data to populate the fields
    }
  }

  /**
   * Angular lifecycle hook that is called after the component's view has been initialized.
   * Used here for any additional initialization logic that might be required.
   */
  ngOnInit(): void {
    // Any additional initialization logic can be added here
  }

  /**
   * Handler for saving the form data.
   * Validates the form, prepares the result, and closes the dialog with the result data.
   */
  onSave(): void {
    if (this.eventForm.valid) { // Check if the form is valid before proceeding
      const result = {
        ...this.eventForm.value, // Spread the form's values (title, date, description)
        index: this.editMode ? this.eventIndex : null // Include event index if in edit mode
      };
      this.dialogRef.close(result); // Close the dialog and pass the result data to the caller
    }
  }

  /**
   * Handler for canceling the operation and closing the dialog.
   * No data is passed back to the caller.
   */
  onCancel(): void {
    this.dialogRef.close(); // Simply close the dialog without returning any result
  }

  /**
   * Handler for canceling an existing event.
   * Passes specific cancellation data (including the event's date and index) back to the caller.
   */
  onCancelEvent(): void {
    this.dialogRef.close({ cancel: true, date: this.data.date, index: this.eventIndex }); // Return cancellation data with the event's date and index
  }
}
