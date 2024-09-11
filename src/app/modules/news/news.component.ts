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

  latestArticles: Article[] = []; // For the latest 3 articles in the carousel
  recentArticles: Article[] = []; // For the next 4 articles in separate boxes
  currentIndex: number = 0; // Carousel index

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

    // Sort articles by date descending
    articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Assign latest 3 articles to the carousel
    this.latestArticles = articles.slice(0, 3);

    // Assign the next 4 articles to separate boxes
    this.recentArticles = articles.slice(3, 7);

    this.archive = this.groupArticlesByDate(articles);
  }

  groupArticlesByDate(articles: Article[]): YearArticles {
    return articles.reduce((acc: YearArticles, article: Article) => {
      const [year, monthNumber, day] = article.date.split('-');
      const monthName = this.monthNames[parseInt(monthNumber, 10) - 1];
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
    this.archive = {};
  }

  handleArchiveCleared() {
    this.clearArchive();
    this.loadArticles();
  }

  resetForm() {
    this.articleForm.reset();
    this.selectedArticle = null;
  }

  selectArticle(article: Article) {
    // If you still need to select an article for editing, add conditions here
    // For carousel dot click, just update the index
    this.currentIndex = this.latestArticles.findIndex(a => a.title === article.title && a.date === article.date);
    /*this.selectedArticle = article;
    this.articleForm.setValue({
      title: article.title,
      content: article.content,
    });*/
  }

  // Carousel Controls
  prevArticle() {
    this.currentIndex = (this.currentIndex === 0) ? this.latestArticles.length - 1 : this.currentIndex - 1;
  }

  nextArticle() {
    this.currentIndex = (this.currentIndex === this.latestArticles.length - 1) ? 0 : this.currentIndex + 1;
  }

  // Method to handle dot click
  onDotClick(index: number) {
    this.currentIndex = index;
  }
}
