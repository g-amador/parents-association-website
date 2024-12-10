import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsAndInformationComponent } from './news-and-information.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { FirestoreService } from '../../../core/services/firestore.service';
import { of } from 'rxjs';

describe('NewsAndInformationComponent', () => {
  let component: NewsAndInformationComponent;
  let fixture: ComponentFixture<NewsAndInformationComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockLocalStorageService: jasmine.SpyObj<LocalStorageService>;
  let mockFirestoreService: jasmine.SpyObj<FirestoreService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    mockLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getAllArticles', 'addArticle', 'deleteArticle']);
    mockFirestoreService = jasmine.createSpyObj('FirestoreService', ['getAllArticles', 'addArticle', 'deleteArticle']);

    await TestBed.configureTestingModule({
      declarations: [NewsAndInformationComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: FirestoreService, useValue: mockFirestoreService },
        { provide: ActivatedRoute, useValue: { data: of({}) } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsAndInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load articles on init', () => {
    spyOn(component, 'loadArticles').and.callThrough();
    component.ngOnInit();
    expect(component.loadArticles).toHaveBeenCalled();
  });

  it('should open edit article dialog for admins', () => {
    spyOn(component, 'openEditArticleDialog').and.callThrough();
    component.isAdminRoute = true;
    const mockArticle = { title: 'Test', content: 'Test content', date: '2024-01-01' };
    component.handleArticleClick(mockArticle);
    expect(component.openEditArticleDialog).toHaveBeenCalledWith(mockArticle);
  });

  it('should open view article dialog for non-admins', () => {
    spyOn(component, 'openViewArticleDialog').and.callThrough();
    component.isAdminRoute = false;
    const mockArticle = { title: 'Test', content: 'Test content', date: '2024-01-01' };
    component.handleArticleClick(mockArticle);
    expect(component.openViewArticleDialog).toHaveBeenCalledWith(mockArticle);
  });
});
