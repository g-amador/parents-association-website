import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-article-dialog',
  templateUrl: './view-article-dialog.component.html',
  styleUrls: ['./view-article-dialog.component.scss']
})
export class ViewArticleDialogComponent {
  /**
   * Constructor that injects article data (title and content) via MAT_DIALOG_DATA.
   *
   * @param data Data injected via MAT_DIALOG_DATA containing article title and content.
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; content: string }) { }
}
