import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  sidebarVisible = true;
  articleForm!: FormGroup;
  selectedArticle: any = null;
  archive: any = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm();
    this.displayArticles();
  }

  createForm() {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  toggleSidebarVisibility(sidebarVisible: boolean) {
    this.sidebarVisible = sidebarVisible;
  }

  addOrUpdateArticle() {
    if (this.articleForm && this.articleForm.valid) {
      const title = this.articleForm.get('title')!.value.trim();
      const content = this.articleForm.get('content')!.value.trim();

      if (title && content) {
        if (this.selectedArticle) {
          this.updateArticle();
        } else {
          this.saveArticle({ title, content });
        }

        this.displayArticles();
        this.resetForm();
      }
    }
  }

  updateArticle() {
    // Update logic similar to the old code
    // You can use this.selectedArticle to get the selected article details
  }

  saveArticle(article: { title: string, content: string }) {
    // Save logic similar to the old code
    // You can use article.title and article.content to get the article details
  }

  displayArticles() {
    // Display logic similar to the old code
    // Update this.archive as needed based on the saved articles
  }

  clearArticles() {
    // Clear logic similar to the old code
  }

  resetForm() {
    this.articleForm.reset();
    this.selectedArticle = null;
  }
}
