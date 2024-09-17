import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Article, YearArticles } from '../../../shared/models/article.model';

@Component({
  selector: 'app-news-archive-sidebar',
  templateUrl: './news-archive-sidebar.component.html',
  styleUrls: ['./news-archive-sidebar.component.scss']
})
export class NewsArchiveSidebarComponent implements OnInit {
  @Input() archive: YearArticles = {};
  @Output() articleSelected = new EventEmitter<Article>();
  @Output() archiveCleared = new EventEmitter<void>();

  ngOnInit() {}

  selectArticle(article: Article) {
    this.articleSelected.emit(article);
  }

  clearArchive() {
    this.archiveCleared.emit();
  }
}
