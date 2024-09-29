import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Article, YearArticles } from '../../shared/models/article.model';
import { EditArticleDialogComponent } from './edit-article-dialog/edit-article-dialog.component';
import { ViewArticleDialogComponent } from './view-article-dialog/view-article-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

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
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {}

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

    dialogRef.afterClosed().subscribe(async result => {
      if (result === 'delete' && article) {
        await this.deleteArticle(article); // Await the deletion
      } else if (result) {
        if (article) {
          await this.updateArticle(article, result.title, result.content); // Await the update
        } else {
          await this.saveArticle(result.title, result.content); // Await the saving
        }
      }
      await this.loadArticles(); // Refresh articles after edit
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

  async saveArticle(title: string, content: string) {
    const date = new Date().toISOString().split('T')[0];
    const article: Article = { title, content, date };
    await this.localStorageService.addArticle(article); // Use the service
  }

  async updateArticle(original: Article, title: string, content: string) {
    // Create an updated article object without altering the date
    const updatedArticle: Article = { ...original, title, content };
    await this.localStorageService.deleteArticle(original); // Delete the old article
    await this.localStorageService.addArticle(updatedArticle); // Add the updated article
  }

  async deleteArticle(article: Article) {
    await this.localStorageService.deleteArticle(article); // Use the service
  }

  async loadArticles() {
    const articles: Article[] = this.localStorageService.getAllArticles(); // Directly use service method

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

  clearArchive() {
    localStorage.removeItem('articles'); // Clear articles from localStorage
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
