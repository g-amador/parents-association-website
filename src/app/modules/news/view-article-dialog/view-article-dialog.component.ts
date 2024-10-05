import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-article-dialog',
  templateUrl: './view-article-dialog.component.html',
  styleUrls: ['./view-article-dialog.component.scss']
})
export class ViewArticleDialogComponent {
  /**
   * The article data containing title and content.
   * Injected through the MAT_DIALOG_DATA.
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; content: string }) {}
}
