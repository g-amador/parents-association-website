import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Article } from '../../../shared/models/article.model';

@Component({
  selector: 'app-edit-article-dialog',
  templateUrl: './edit-article-dialog.component.html',
  styleUrls: ['./edit-article-dialog.component.scss']
})
export class EditArticleDialogComponent implements OnInit {
  articleForm!: FormGroup; // Form group for the article form

  /**
   * Constructor for the EditArticleDialogComponent.
   * Initializes the form builder, dialog reference, and dialog data.
   *
   * @param fb Inject FormBuilder for creating reactive forms.
   * @param dialogRef Reference to the dialog, used for closing the dialog.
   * @param data Inject data passed to the dialog (article being edited or null for new articles).
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditArticleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { article: Article | null }
  ) { }

  /**
   * Initialize the form when the component is created.
   */
  ngOnInit() {
    this.createForm();
  }

  /**
   * Create the form group and set initial values.
   */
  createForm() {
    this.articleForm = this.fb.group({
      // Pre-fill the form with existing article data if provided, otherwise start empty
      title: [this.data.article ? this.data.article.title : '', Validators.required],
      content: [this.data.article ? this.data.article.content : ''],
    });
  }

  /**
   * Method to handle saving the form data.
   */
  save() {
    if (this.articleForm.valid) {
      // Close the dialog and pass back the form value if the form is valid
      this.dialogRef.close(this.articleForm.value);
    }
  }

  /**
   * Method to handle cancellation (close the dialog without returning any data).
   */
  cancel() {
    this.dialogRef.close();
  }

  /**
   * Method to handle deleting the article (close the dialog and return 'delete').
   */
  delete() {
    this.dialogRef.close('delete');
  }
}
