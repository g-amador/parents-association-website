import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-event-dialog',
  templateUrl: './view-event-dialog.component.html',
  styleUrls: ['./view-event-dialog.component.scss']
})
export class ViewEventDialogComponent {

  /**
   * Constructor that injects event data from the dialog.
   *
   * @param data - Contains the title and description of the event.
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; description: string }) { }
}
