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
  @Input() archive: YearArticles = {};
  @Output() articleSelected = new EventEmitter<{ article: Article; isAdmin: boolean }>();
  @Output() archiveCleared = new EventEmitter<void>();

  isAdminRoute: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.isAdminRoute = this.authService.isAuthenticated();
    });
  }

  selectArticle(article: Article) {
    this.articleSelected.emit({ article, isAdmin: this.isAdminRoute });
  }

  clearArchive() {
    this.archiveCleared.emit();
  }
}
