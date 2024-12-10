import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ViewArticleDialogComponent } from './view-article-dialog.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('ViewArticleDialogComponent', () => {
  let component: ViewArticleDialogComponent;
  let fixture: ComponentFixture<ViewArticleDialogComponent>;
  let debugElement: DebugElement;

  const mockArticleData = {
    title: 'Sample Title',
    content: 'This is the content of the article.'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewArticleDialogComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockArticleData } // Inject mock article data
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewArticleDialogComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges(); // Trigger change detection
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the article title', () => {
    const titleElement = debugElement.query(By.css('.article-title')).nativeElement;
    expect(titleElement.textContent).toContain(mockArticleData.title);
  });

  it('should display the article content', () => {
    const contentElement = debugElement.query(By.css('.article-content')).nativeElement;
    expect(contentElement.textContent).toContain(mockArticleData.content);
  });
});
