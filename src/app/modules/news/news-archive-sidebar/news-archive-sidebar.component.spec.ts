import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsArchiveSidebarComponent } from './news-archive-sidebar.component';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Article } from '../../../shared/models/article.model';

describe('NewsArchiveSidebarComponent', () => {
  let component: NewsArchiveSidebarComponent;
  let fixture: ComponentFixture<NewsArchiveSidebarComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated']);

    await TestBed.configureTestingModule({
      declarations: [NewsArchiveSidebarComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: { data: of({}) } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsArchiveSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set isAdminRoute based on authentication status', () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    component.ngOnInit();
    expect(component.isAdminRoute).toBeTrue();
  });

  it('should emit articleSelected with the correct data when an article is selected', () => {
    spyOn(component.articleSelected, 'emit');
    const mockArticle: Article = { title: 'Test Article', content: 'Test Content', date: '2024-01-01' };
    component.isAdminRoute = true; // Simulate admin route

    component.selectArticle(mockArticle);

    expect(component.articleSelected.emit).toHaveBeenCalledWith({ article: mockArticle, isAdmin: true });
  });

  it('should emit archiveCleared when the archive is cleared', () => {
    spyOn(component.archiveCleared, 'emit');

    component.clearArchive();

    expect(component.archiveCleared.emit).toHaveBeenCalled();
  });

  it('should handle user as non-admin correctly', () => {
    mockAuthService.isAuthenticated.and.returnValue(false);
    component.ngOnInit();
    expect(component.isAdminRoute).toBeFalse();
  });
});
