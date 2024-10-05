import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Article, YearArticles } from '../../shared/models/article.model';
import { EditArticleDialogComponent } from './edit-article-dialog/edit-article-dialog.component';
import { ViewArticleDialogComponent } from './view-article-dialog/view-article-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  /**
   * Determines whether the sidebar is visible.
   */
  sidebarVisible = true;

  /**
   * Stores articles grouped by year and month.
   */
  archive: YearArticles = {};

  /**
   * Holds the latest articles.
   */
  latestArticles: Article[] = [];

  /**
   * Holds recent articles, excluding the latest ones.
   */
  recentArticles: Article[] = [];

  /**
   * Tracks the index of the current article in the carousel.
   */
  currentIndex: number = 0;

  /**
   * Indicates whether the current route is for admin users.
   */
  isAdminRoute: boolean = false;

  // The service used for storing articles, chosen dynamically based on environment
  private articleService: LocalStorageService | FirestoreService;

  // Array containing month names for easier reference when grouping articles
  private monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  /**
   * Constructor for the NewsComponent.
   * Initializes the required services and dynamically chooses
   * between Firestore or LocalStorage based on the environment.
   * @param dialog Inject MatDialog for opening dialogs.
   * @param route Inject ActivatedRoute for accessing route data.
   * @param authService Inject AuthService for user authentication.
   * @param localStorageService Inject LocalStorageService for managing local storage.
   * @param firestoreService Inject FirestoreService for managing Firestore.
   */
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private firestoreService: FirestoreService
  ) {
    // Dynamically choose between Firestore or LocalStorage based on environment
    this.articleService = environment.production && !environment.useLocalStorage
      ? this.firestoreService
      : this.localStorageService;
  }

  /**
   * Initializes the component by adjusting sidebar visibility
   * and loading articles. Also determines if the user is on an admin route.
   */
  ngOnInit() {
    this.adjustSidebarVisibility();
    this.loadArticles();

    // Determine if the current route is for admins
    this.route.data.subscribe(data => {
      this.isAdminRoute = this.authService.isAuthenticated();
    });
  }

  /**
   * Adjusts sidebar visibility based on window width.
   */
  adjustSidebarVisibility() {
    this.sidebarVisible = window.innerWidth > 768; // Adjust the breakpoint as needed
  }

  /**
   * Toggles the visibility of the sidebar.
   * @param sidebarVisible New visibility state for the sidebar.
   */
  toggleSidebarVisibility(sidebarVisible: boolean) {
    this.sidebarVisible = sidebarVisible;
  }

  /**
   * Opens the edit article dialog for admins. Otherwise, opens a view article dialog.
   * @param article The article to be edited or viewed.
   */
  handleArticleClick(article: Article) {
    if (this.isAdminRoute) {
      this.openEditArticleDialog(article);
    } else {
      this.openViewArticleDialog(article);
    }
  }

  /**
   * Handles article selection based on the user's admin status.
   * @param param0 The selected article and admin status.
   */
  handleArticleSelection({ article, isAdmin }: { article: Article; isAdmin: boolean }) {
    if (isAdmin) {
      this.openEditArticleDialog(article);
    } else {
      this.openViewArticleDialog(article);
    }
  }

  /**
   * Opens the edit article dialog for a given article.
   * @param article The article to edit, or null if creating a new article.
   */
  openEditArticleDialog(article: Article | null) {
    const dialogRef = this.dialog.open(EditArticleDialogComponent, {
      width: '500px',
      data: { article }
    });

    // Handle the result of the dialog (e.g., save, update, or delete)
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

  /**
   * Opens a dialog to view the article content.
   * @param article The article to view.
   */
  openViewArticleDialog(article: Article) {
    this.dialog.open(ViewArticleDialogComponent, {
      width: '400px',
      data: { title: article.title, content: article.content }
    });
  }

  /**
   * Saves a new article to the appropriate service.
   * @param title The title of the article.
   * @param content The content of the article.
   */
  async saveArticle(title: string, content: string) {
    const date = new Date().toISOString().split('T')[0];
    const article: Article = { title, content, date };

    await this.articleService.addArticle(article);
  }

  /**
   * Updates an existing article.
   * @param original The original article before the update.
   * @param title The updated title.
   * @param content The updated content.
   */
  async updateArticle(original: Article, title: string, content: string) {
    const updatedArticle: Article = { ...original, title, content };

    if (environment.production && !environment.useLocalStorage) {
      const articleId = original.id;
      if (articleId) {
        await (this.articleService as FirestoreService).updateArticle(articleId, updatedArticle);
      }
    } else {
      await this.localStorageService.deleteArticle(original);
      await this.localStorageService.addArticle(updatedArticle);
    }
  }

  /**
   * Deletes the specified article.
   * @param article The article to delete.
   */
  async deleteArticle(article: Article) {
    if (environment.production && !environment.useLocalStorage) {
      if (article.id) {
        await (this.articleService as FirestoreService).deleteArticle(article.id);
      } else {
        console.error('Article ID is missing, cannot delete.');
      }
    } else {
      await (this.articleService as LocalStorageService).deleteArticle(article);
    }
  }

  /**
   * Loads all articles from the chosen service and processes them.
   */
  async loadArticles() {
    let articles: Article[] = [];

    if (environment.production && !environment.useLocalStorage) {
      const articlesObservable = (this.articleService as FirestoreService).getAllArticles();
      articlesObservable.subscribe((fetchedArticles) => {
        articles = fetchedArticles;
        this.processArticles(articles);
      });
    } else {
      articles = this.localStorageService.getAllArticles();
      this.processArticles(articles);
    }
  }

  /**
   * Sorts articles and groups them by date.
   * @param articles The array of articles to process.
   */
  processArticles(articles: Article[]) {
    // Sort articles by date descending
    articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    this.latestArticles = articles.slice(0, 3);
    this.recentArticles = articles.slice(3, 7);
    this.archive = this.groupArticlesByDate(articles);
  }

  /**
   * Groups articles by year and month.
   * @param articles The array of articles to group.
   * @returns An object where articles are grouped by year, month, and day.
   */
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

  /**
   * Clears all archived articles.
   */
  clearArchive() {
    if (environment.production && !environment.useLocalStorage) {
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

  /**
   * Handles the action to clear the article archive.
   */
  handleArchiveCleared() {
    this.clearArchive();
  }

  /**
   * Shows the previous article in the carousel.
   */
  prevArticle() {
    this.currentIndex = (this.currentIndex === 0) ? this.latestArticles.length - 1 : this.currentIndex - 1;
  }

  /**
   * Shows the next article in the carousel.
   */
  nextArticle() {
    this.currentIndex = (this.currentIndex === this.latestArticles.length - 1) ? 0 : this.currentIndex + 1;
  }

  /**
   * Handles navigation through carousel dots.
   * @param index The index of the dot clicked.
   */
  onDotClick(index: number) {
    this.currentIndex = index;
  }
}
