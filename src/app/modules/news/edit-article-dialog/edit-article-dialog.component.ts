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
  articleForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditArticleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { article: Article | null }
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.articleForm = this.fb.group({
      title: [this.data.article ? this.data.article.title : '', Validators.required],
      content: [this.data.article ? this.data.article.content : ''],
    });
  }

  save() {
    if (this.articleForm.valid) {
      this.dialogRef.close(this.articleForm.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  // This method will be called when the delete button is clicked.
  delete() {
    // You can return a special value or trigger a service call to delete the article
    this.dialogRef.close('delete');
  }
}
