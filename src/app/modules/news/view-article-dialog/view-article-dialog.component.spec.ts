import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewArticleDialogComponent } from './view-article-dialog.component';

describe('ViewArticleDialogComponent', () => {
  let component: ViewArticleDialogComponent;
  let fixture: ComponentFixture<ViewArticleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewArticleDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewArticleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
