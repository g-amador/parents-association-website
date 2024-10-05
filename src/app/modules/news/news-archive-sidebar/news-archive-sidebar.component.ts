import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Article, YearArticles } from '../../../shared/models/article.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-news-archive-sidebar',
  templateUrl: './news-archive-sidebar.component.html',
  styleUrls: ['./news-archive-sidebar.component.scss']
})
export class NewsArchiveSidebarComponent implements OnInit {
  /**
   * The article archive input, where articles are grouped by year and month.
   */
  @Input() archive: YearArticles = {};

  /**
   * Emits the selected article when clicked, along with admin status.
   */
  @Output() articleSelected = new EventEmitter<{ article: Article; isAdmin: boolean }>();

  /**
   * Emits when the archive is cleared.
   */
  @Output() archiveCleared = new EventEmitter<void>();

  // Tracks whether the current route is an admin route
  isAdminRoute: boolean = false;

  /**
   * Constructor for the NewsArchiveSidebarComponent.
   * Initializes the route and authentication services.
   * @param route Inject ActivatedRoute for accessing route data.
   * @param authService Inject AuthService for user authentication.
   */
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  /**
   * Lifecycle hook that initializes the component.
   * Subscribes to route data and sets `isAdminRoute` based on user authentication.
   */
  ngOnInit() {
    this.route.data.subscribe(data => {
      this.isAdminRoute = this.authService.isAuthenticated();
    });
  }

  /**
   * Emits the selected article along with the current admin route status.
   * @param article The article selected from the archive.
   */
  selectArticle(article: Article) {
    this.articleSelected.emit({ article, isAdmin: this.isAdminRoute });
  }

  /**
   * Emits an event to clear the archive.
   */
  clearArchive() {
    this.archiveCleared.emit();
  }
}
