import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Article } from 'src/app/shared/models/article.model'; // Adjust path as needed

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
}
