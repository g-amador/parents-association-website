import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Article, YearArticles } from '../../../shared/models/article.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-news-archive-sidebar',
  templateUrl: './news-archive-sidebar.component.html',
  styleUrls: ['./news-archive-sidebar.component.scss']
})
export class NewsArchiveSidebarComponent implements OnInit {
  @Input() archive: YearArticles = {};
  @Output() articleSelected = new EventEmitter<Article>();
  @Output() archiveCleared = new EventEmitter<void>();

  isAdminRoute: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.isAdminRoute = data['isAdminRoute'];
    });

  }

  selectArticle(article: Article) {
    if (this.isAdminRoute) {
      this.articleSelected.emit(article);
    }
  }

  clearArchive() {
    this.archiveCleared.emit();
  }
}
