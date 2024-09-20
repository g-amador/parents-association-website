import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Article, YearArticles } from '../../shared/models/article.model';
import { EditArticleDialogComponent } from './edit-article-dialog/edit-article-dialog.component';
import { ViewArticleDialogComponent } from './view-article-dialog/view-article-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  sidebarVisible = true; // Default to true, will adjust based on screen size
  archive: YearArticles = {};

  latestArticles: Article[] = []; // For the latest 3 articles in the carousel
  recentArticles: Article[] = []; // For the next 4 articles in separate boxes
  currentIndex: number = 0; // Carousel index

  isAdminRoute: boolean = false; // Determine if the route is admin

  private monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private authService: AuthService) {}

  ngOnInit() {
    this.adjustSidebarVisibility();
    this.loadArticles();

    this.route.data.subscribe(data => {
      this.isAdminRoute = this.authService.isAuthenticated();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.adjustSidebarVisibility();
  }

  adjustSidebarVisibility() {
    this.sidebarVisible = window.innerWidth > 768; // Adjust the breakpoint as needed
  }

  toggleSidebarVisibility(sidebarVisible: boolean) {
    this.sidebarVisible = sidebarVisible;
  }

  openEditArticleDialog(article: Article | null) {
    const dialogRef = this.dialog.open(EditArticleDialogComponent, {
      width: '500px',
      data: { article }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete' && article) {
        this.deleteArticle(article);
      } else if (result) {
        if (article) {
          this.updateArticle(article, result.title, result.content);
        } else {
          this.saveArticle(result.title, result.content);
        }
      }
      this.loadArticles(); // Refresh articles after edit
    });
  }

  openViewArticleDialog(article: Article) {
    this.dialog.open(ViewArticleDialogComponent, {
      width: '400px',
      data: { title: article.title, content: article.content }
    });
  }

  handleArticleClick(article: Article) {
    if (this.isAdminRoute) {
      this.openEditArticleDialog(article);
    } else {
      this.openViewArticleDialog(article);
    }
  }

  handleArticleSelection({ article, isAdmin }: { article: Article; isAdmin: boolean }) {
    if (isAdmin) {
      this.openEditArticleDialog(article);
    } else {
      this.openViewArticleDialog(article);
    }
  }

  saveArticle(title: string, content: string) {
    const date = new Date().toISOString().split('T')[0];
    const article: Article = { title, content, date };
    const articles = this.getArticlesFromLocalStorage();
    articles.push(article);
    localStorage.setItem('articles', JSON.stringify(articles));
  }

  updateArticle(original: Article, title: string, content: string) {
    const articles = this.getArticlesFromLocalStorage();
    const index = articles.findIndex(a => a.date === original.date && a.title === original.title);
    if (index !== -1) {
      articles[index] = { ...original, title, content };
      localStorage.setItem('articles', JSON.stringify(articles));
    }
  }

  deleteArticle(article: Article) {
    const articles = this.getArticlesFromLocalStorage();
    const updatedArticles = articles.filter(a => !(a.title === article.title && a.date === article.date));
    localStorage.setItem('articles', JSON.stringify(updatedArticles));
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
    this.loadArticles();
  }

  handleArchiveCleared() {
    this.clearArchive();
  }

  prevArticle() {
    this.currentIndex = (this.currentIndex === 0) ? this.latestArticles.length - 1 : this.currentIndex - 1;
  }

  nextArticle() {
    this.currentIndex = (this.currentIndex === this.latestArticles.length - 1) ? 0 : this.currentIndex + 1;
  }

  onDotClick(index: number) {
    this.currentIndex = index;
  }
}
