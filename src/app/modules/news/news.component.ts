import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Article, YearArticles } from '../../shared/models/article.model';
import { EditArticleDialogComponent } from './edit-article-dialog/edit-article-dialog.component';
import { ViewArticleDialogComponent } from './view-article-dialog/view-article-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { FirestoreService } from 'src/app/core/services/firestore.service'; // Import Firestore service
import { environment } from 'src/environments/environment'; // Import environment

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  sidebarVisible = true;
  archive: YearArticles = {};
  latestArticles: Article[] = [];
  recentArticles: Article[] = [];
  currentIndex: number = 0;
  isAdminRoute: boolean = false;

  private articleService: LocalStorageService | FirestoreService; // Dynamic service based on environment
  private monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private firestoreService: FirestoreService // Inject FirestoreService
  ) {
    // Decide which service to use based on environment
    this.articleService = environment.production && !environment.useLocalStorage
      ? this.firestoreService
      : this.localStorageService;
  }

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
        await this.deleteArticle(article);
      } else if (result) {
        if (article) {
          await this.updateArticle(article, result.title, result.content);
        } else {
          await this.saveArticle(result.title, result.content);
        }
      }
      await this.loadArticles(); // Refresh articles
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

    if (environment.production && !environment.useLocalStorage) {
      // Use Firestore service to add the article (let Firestore generate the document ID)
      await (this.articleService as FirestoreService).addArticle(article);
    } else {
      // Local storage service to save the article
      await (this.articleService as LocalStorageService).addArticle(article);
    }
  }

  async updateArticle(original: Article, title: string, content: string) {
    const updatedArticle: Article = { ...original, title, content };

    if (environment.production && !environment.useLocalStorage) {
      // Pass the document ID to update the article
      const articleId = original.id; // Ensure `idField: 'id'` in Firestore collection
      if (articleId) {
        await (this.articleService as FirestoreService).updateArticle(articleId, updatedArticle);
      }
    } else {
      // Local storage service to update the article
      await this.localStorageService.deleteArticle(original);
      await this.localStorageService.addArticle(updatedArticle);
    }
  }

  async deleteArticle(article: Article) {
    if (environment.production && !environment.useLocalStorage) {
      if (article.id) {
        // Pass the Firestore document ID to delete the article
        await (this.articleService as FirestoreService).deleteArticle(article.id);
      } else {
        console.error('Article ID is missing, cannot delete.');
      }
    } else {
      await (this.articleService as LocalStorageService).deleteArticle(article);
    }
  }

  async loadArticles() {
    let articles: Article[] = [];

    // Fetch articles based on the selected service
    if (environment.production && !environment.useLocalStorage) {
      const articlesObservable = (this.articleService as FirestoreService).getArticles();
      articlesObservable.subscribe((fetchedArticles) => {
        articles = fetchedArticles;
        this.processArticles(articles);
      });
    } else {
      articles = this.localStorageService.getAllArticles();
      this.processArticles(articles);
    }
  }

  processArticles(articles: Article[]) {
    // Sort articles by date descending
    articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    this.latestArticles = articles.slice(0, 3);
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
    if (environment.production && !environment.useLocalStorage) {
      // Clear all articles from Firestore
      this.firestoreService.deleteAllArticles()
        .then(() => {
          console.log("All articles cleared from Firestore");
          this.archive = {}; // Reset the archive
          this.loadArticles(); // Reload articles to reflect changes
        })
        .catch((error) => {
          console.error("Error clearing articles from Firestore: ", error);
        });
    } else {
      localStorage.removeItem('articles'); // Clear articles from localStorage
      this.archive = {}; // Reset the archive
      this.loadArticles(); // Reload articles to reflect changes
    }
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
