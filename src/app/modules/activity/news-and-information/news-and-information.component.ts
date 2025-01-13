import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Article, YearArticles } from '../../../shared/models/article.model';
import { EditArticleDialogComponent } from './edit-article-dialog/edit-article-dialog.component';
import { ViewArticleDialogComponent } from './view-article-dialog/view-article-dialog.component';
import { AuthService } from '../../../core/services/auth.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { FirestoreService } from '../../../core/services/firestore.service';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-news-and-information',
  templateUrl: './news-and-information.component.html',
  styleUrls: ['./news-and-information.component.scss']
})
export class NewsAndInformationComponent implements OnInit {
  @ViewChild(MatPaginator) matPaginator!: MatPaginator;

  /**
   * Stores articles grouped by year and month.
   */
  archive: YearArticles = {};

  /**
   * Holds recent articles, excluding the latest ones.
   */
  recentArticles: Article[] = [];

  /**
   * Holds articles to display per page articles, excluding the latest ones.
   */
  displayedArticles: Article[] = [];

  /**
   * Indicates whether the current route is for admin users.
   */
  isAdminRoute: boolean = false;

  /**
   * Current page.
   */
  currentPage: number = 0;

  /**
   * Number of articles per page.
   */
  pageSize: number = 8;

  // The service used for storing articles, chosen dynamically based on environment
  private articleService: LocalStorageService | FirestoreService;

  // Array containing month names for easier reference when grouping articles
  private monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  /**
   * Constructor for the NewsAndInformationComponent.
   * Initializes the required services and dynamically chooses
   * between Firestore or LocalStorage based on the environment.
   *
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
    private firestoreService: FirestoreService,
    private http: HttpClient,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
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
    this.loadArticles();

    // Set first translation to 'pt' and subscribe to language changes
    this.translate.use('pt');
    this.translate.onLangChange.subscribe(() => {
      this.setPaginatorLabels();
    });

    // Determine if the current route is for admins
    this.route.data.subscribe(data => {
      this.isAdminRoute = this.authService.isAuthenticated();
    });
  }

  // Function to update paginator labels based on selected language
  private setPaginatorLabels() {
    console.log("setPaginatorLabels")
    console.log(this.translate);
    console.log(this.matPaginator);

    // Update the paginator labels using translations
    this.translate.get('news-and-information_page.items_per_page').subscribe((translation: string) => {
      this.matPaginator._intl.itemsPerPageLabel = translation;
    });

    this.translate.get('news-and-information_page.next_page').subscribe((translation: string) => {
      this.matPaginator._intl.nextPageLabel = translation;
    });

    this.translate.get('news-and-information_page.previous_page').subscribe((translation: string) => {
      this.matPaginator._intl.previousPageLabel = translation;
    });

    // Custom range label logic
    this.translate.get('news-and-information_page.range_label').subscribe((translation: string) => {
      this.matPaginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 ${translation} ${length}`;
        }
        const startIndex = page * pageSize;
        const endIndex = Math.min(startIndex + pageSize, length);
        return `${startIndex + 1} – ${endIndex} ${translation} ${length}`;
      };
    });

    // Notify Angular Material paginator to re-render the UI
    this.matPaginator._intl.changes.next();

    console.log(this.matPaginator);
  }

  /**
   * Opens the edit article dialog for admins. Otherwise, opens a view article dialog.
   *
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
   *
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
   * Handles the action to clear the article archive.
   */
  handleArchiveCleared() {
    this.clearArchive();
  }

  /**
   * Opens the edit article dialog for a given article.
   *
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
   *
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
   *
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
   *
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
      const { id, ...rest } = updatedArticle; // Remove `id`
      await (this.articleService as LocalStorageService).deleteArticle(original);
      await (this.articleService as LocalStorageService).addArticle(rest);
    }
  }

  /**
   * Deletes the specified article.
   *
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
      articlesObservable.subscribe(async (fetchedArticles) => {
        if (fetchedArticles.length === 0) {
          articles = await this.loadArticlesFromJson();
          this.saveArticlesToService(articles);
        } else {
          articles = fetchedArticles;
        }
        this.processArticles(articles);
      });
    } else {
      articles = (this.articleService as LocalStorageService).getAllArticles();
      if (articles.length === 0) {
        articles = await this.loadArticlesFromJson();
        this.saveArticlesToService(articles);
      }
      this.processArticles(articles);
    }
  }

  /**
   * Loads articles from the `news.json` file.
   *
   * @returns A promise resolving to an array of articles.
   */
  private async loadArticlesFromJson(): Promise<Article[]> {
    try {
      const articles = await this.http.get<Article[]>('/assets/data/news.json').toPromise();
      return articles || []; // Return an empty array if articles is undefined
    } catch (error) {
      console.error('Failed to load articles from JSON:', error);
      return []; // Return an empty array on error
    }
  }

  /**
   * Saves articles to the chosen service (Firestore or LocalStorage).
   *
   * @param articles The articles to save.
   */
  private async saveArticlesToService(articles: Article[]) {
    const existingArticles = (this.articleService as LocalStorageService).getAllArticles();
    articles.forEach(async article => {
      const isDuplicate = existingArticles.some(a => a.title === article.title && a.content === article.content);
      if (!isDuplicate) {
        const { id, ...rest } = article; // Remove `id`
        await this.articleService.addArticle(rest);
      }
    });
  }

  /**
   * Filters articles from the past two months and groups them by date.
   *
   * @param articles The array of articles to process.
   */
  processArticles(articles: Article[]) {
    const now = new Date();
    const twoMonthsAgo = new Date(now);
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    // Filter articles for the last two months
    const pastTwoMonthsArticles = articles.filter(article => {
      const articleDate = new Date(article.date);
      return articleDate >= twoMonthsAgo && articleDate <= now;
    });

    pastTwoMonthsArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Assign recent articles for the "News and Information" section
    this.recentArticles = pastTwoMonthsArticles;

    // Update displayed articles after sorting and filtering
    this.updateDisplayedArticles();

    // Group all articles (not just recent ones) for the archive
    this.archive = this.groupArticlesByDate(articles);
  }

  /**
   * Updates the articles that should be displayed on the current page.
   */
  updateDisplayedArticles() {
    // Paginate the articles by slicing the `recentArticles` array
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedArticles = this.recentArticles.slice(startIndex, endIndex);
  }

  /**
   * Handles the change in the paginator's page.
   * Updates the displayed articles based on the selected page.
   *
   * @param event The paginator's page change event, containing the pageIndex.
   */
  onPageChange(event: { pageIndex: number; }) {
    this.currentPage = event.pageIndex;
    this.updateDisplayedArticles();
  }

  /**
  * Groups articles by year, month, and day.
  *
  * @param articles The array of articles to group.
  * @returns A YearArticles object where articles are grouped by year, month, and day.
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
      this.articleService.deleteAllArticles()
        .then(() => {
          console.log("All articles cleared from Firestore");
          this.archive = {}; // Reset the archive
          this.loadArticles(); // Reload articles to reflect changes
        })
        .catch((error) => {
          console.error("Error clearing articles from Firestore: ", error);
        });
    } else {
      this.articleService.deleteAllArticles();
      this.archive = {}; // Reset the archive
      this.loadArticles(); // Reload articles to reflect changes
    }
  }
}
