import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsArchiveSidebarComponent } from './news-archive-sidebar.component';

describe('NewsArchiveSidebarComponent', () => {
  let component: NewsArchiveSidebarComponent;
  let fixture: ComponentFixture<NewsArchiveSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewsArchiveSidebarComponent]
    });
    fixture = TestBed.createComponent(NewsArchiveSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
