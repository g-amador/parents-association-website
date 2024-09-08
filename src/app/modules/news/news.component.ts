import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Article, YearArticles } from 'src/app/shared/models/article.model'; // Adjust path as needed

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  sidebarVisible = true;
  articleForm!: FormGroup;
  selectedArticle: Article | null = null;
  archive: YearArticles = {};

  private monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm();
    this.loadArticles();
  }

  createForm() {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      content: [''],
    });
  }

  toggleSidebarVisibility(sidebarVisible: boolean) {
    this.sidebarVisible = sidebarVisible;
  }

  addOrUpdateArticle() {
    if (this.articleForm.valid) {
      const title = this.articleForm.get('title')!.value.trim();
      const content = this.articleForm.get('content')!.value.trim();

      if (title && content) {
        if (this.selectedArticle) {
          this.updateArticle(title, content);
        } else {
          this.saveArticle(title, content);
        }

        this.loadArticles();
        this.resetForm();
      }
    }
  }

  saveArticle(title: string, content: string) {
    const date = new Date().toISOString().split('T')[0];
    const article: Article = { title, content, date };
    const articles = this.getArticlesFromLocalStorage();
    articles.push(article);
    localStorage.setItem('articles', JSON.stringify(articles));
  }

  updateArticle(title: string, content: string) {
    const articles = this.getArticlesFromLocalStorage();
    const index = articles.findIndex((a: Article) => a.date === this.selectedArticle?.date && a.title === this.selectedArticle?.title);
    if (index !== -1) {
      articles[index] = { ...this.selectedArticle!, title, content };
      localStorage.setItem('articles', JSON.stringify(articles));
    }
  }

  loadArticles() {
    const articles = this.getArticlesFromLocalStorage();
    this.archive = this.groupArticlesByDate(articles);
  }

  groupArticlesByDate(articles: Article[]): YearArticles {
    return articles.reduce((acc: YearArticles, article: Article) => {
      const [year, monthNumber, day] = article.date.split('-');
      const monthName = this.monthNames[parseInt(monthNumber, 10) - 1]; // Convert month number to name
      if (!acc[year]) acc[year] = {};
      if (!acc[year][monthName]) acc[year][monthName] = {};
      if (!acc[year][monthName][day]) acc[year][monthName][day] = [];
      acc[year][monthName][day].push(article);
      return acc;
    }, {});
  }

  getArticlesFromLocalStorage(): Article[] {
    const articles = localStorage.getItem('articles');
    return articles ? JSON.parse(articles) : [];
  }

  clearArchive() {
    localStorage.removeItem('articles');
    this.archive = {}; // Clear the archive object in the component
  }

  resetForm() {
    this.articleForm.reset();
    this.selectedArticle = null;
  }

  selectArticle(article: Article) {
    this.selectedArticle = article;
    this.articleForm.setValue({
      title: article.title,
      content: article.content,
    });
  }
}
