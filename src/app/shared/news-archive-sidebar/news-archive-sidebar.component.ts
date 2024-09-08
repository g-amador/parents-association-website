import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Article, YearArticles } from 'src/app/shared/models/article.model'; // Adjust path as needed

@Component({
  selector: 'app-news-archive-sidebar',
  templateUrl: './news-archive-sidebar.component.html',
  styleUrls: ['./news-archive-sidebar.component.scss']
})
export class NewsArchiveSidebarComponent implements OnInit {
  @Input() archive: YearArticles = {};
  @Output() articleSelected = new EventEmitter<Article>();

  ngOnInit() {}

  selectArticle(article: Article) {
    this.articleSelected.emit(article);
  }
}
