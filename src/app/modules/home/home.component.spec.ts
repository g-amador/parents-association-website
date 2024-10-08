import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { of, throwError } from 'rxjs';
import { Article } from '../../shared/models/article.model';
import { Event } from '../../shared/models/event.model';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let firestoreService: jasmine.SpyObj<FirestoreService>;

  beforeEach(() => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['getAllArticles', 'getAllEvents']);
    const firestoreSpy = jasmine.createSpyObj('FirestoreService', ['getAllArticles', 'getAllEvents']);

    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: LocalStorageService, useValue: localStorageSpy },
        { provide: FirestoreService, useValue: firestoreSpy }
      ]
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    localStorageService = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
    firestoreService = TestBed.inject(FirestoreService) as jasmine.SpyObj<FirestoreService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should adjust sidebar visibility based on window size', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(800);
    component.adjustSidebarVisibility();
    expect(component.sidebarVisible).toBeTrue();

    spyOnProperty(window, 'innerWidth').and.returnValue(500);
    component.adjustSidebarVisibility();
    expect(component.sidebarVisible).toBeFalse();
  });

  it('should load latest articles from local storage', async () => {
    const mockArticles: Article[] = [
      { id: '1', title: 'Article 1', content: 'Content 1', date: '2024-10-01' },
      { id: '2', title: 'Article 2', content: 'Content 2', date: '2024-10-02' },
      { id: '3', title: 'Article 3', content: 'Content 3', date: '2024-10-03' },
    ];
    localStorageService.getAllArticles.and.returnValue(mockArticles);
    await component.loadLatestArticles();
    expect(component.latestArticles.length).toBe(3);
  });

  it('should load latest articles from Firestore', () => {
    const mockArticles: Article[] = [
      { id: '1', title: 'Article 1', content: 'Content 1', date: '2024-10-01' },
      { id: '2', title: 'Article 2', content: 'Content 2', date: '2024-10-02' },
      { id: '3', title: 'Article 3', content: 'Content 3', date: '2024-10-03' },
    ];
    firestoreService.getAllArticles.and.returnValue(of(mockArticles));

    component.loadLatestArticles();
    expect(component.latestArticles.length).toBe(3);
    expect(firestoreService.getAllArticles).toHaveBeenCalled();
  });

  it('should handle errors when loading articles from Firestore', () => {
    firestoreService.getAllArticles.and.returnValue(throwError('Error loading articles'));

    component.loadLatestArticles();
    expect(component.latestArticles.length).toBe(0); // Assuming it does not set latestArticles on error
  });

  it('should load upcoming events from local storage', async () => {
    const mockEvents: { [key: string]: Event[] } = {
      '2024-10-01': [
        { title: 'Event 1', date: '2024-10-01', description: 'Description 1' }
      ],
      '2024-10-02': [
        { title: 'Event 2', date: '2024-10-02', description: 'Description 2' }
      ],
      '2024-10-03': [
        { title: 'Event 3', date: '2024-10-03', description: 'Description 3' }
      ],
    };

    // Set up the local storage service mock to return the mock events
    localStorageService.getAllEvents.and.returnValue(Promise.resolve(mockEvents));

    // Call the method to load upcoming events
    await component.loadUpcomingEvents();

    // Verify that the upcomingEvents array is populated correctly
    expect(component.upcomingEvents.length).toBe(3); // Check length
    expect(component.upcomingEvents).toEqual([
      { title: 'Event 1', date: '2024-10-01', description: 'Description 1' },
      { title: 'Event 2', date: '2024-10-02', description: 'Description 2' },
      { title: 'Event 3', date: '2024-10-03', description: 'Description 3' }
    ]); // Verify the events are the same as mock
  });


  it('should load upcoming events from Firestore', () => {
    const mockEvents: Event[] = [
      { title: 'Event 1', date: '2024-10-01', description: 'Description 1' },
      { title: 'Event 2', date: '2024-10-02', description: 'Description 2' },
      { title: 'Event 3', date: '2024-10-03', description: 'Description 3' },
    ];
    firestoreService.getAllEvents.and.returnValue(of(mockEvents));

    component.loadUpcomingEvents();
    expect(component.upcomingEvents.length).toBe(3);
    expect(firestoreService.getAllEvents).toHaveBeenCalled();
  });

  it('should handle errors when loading events from Firestore', () => {
    firestoreService.getAllEvents.and.returnValue(throwError('Error loading events'));

    component.loadUpcomingEvents();
    expect(component.upcomingEvents.length).toBe(0); // Assuming it does not set upcomingEvents on error
  });

  it('should process events correctly', () => {
    const mockEvents: Event[] = [
      { title: 'Event 1', date: '2024-10-01' },
      { title: 'Event 2', date: '2024-10-05' },
    ];
    component.processEvents(mockEvents);
    expect(component.upcomingEvents.length).toBe(2); // Should limit to 3
  });

  it('should start and stop article carousel rotation', () => {
    component.latestArticles = [
      { id: '1', title: 'Article 1', content: 'Content 1', date: '2024-10-01' },
      { id: '2', title: 'Article 2', content: 'Content 2', date: '2024-10-02' }
    ];
    component.startCarouselRotation();
    expect(component.intervalId).toBeDefined();
    component.stopCarouselRotation();
    expect(component.intervalId).toBeUndefined();
  });

  it('should navigate articles in the carousel', () => {
    component.latestArticles = [
      { id: '1', title: 'Article 1', content: 'Content 1', date: '2024-10-01' },
      { id: '2', title: 'Article 2', content: 'Content 2', date: '2024-10-02' }
    ];
    component.selectArticle(1);
    expect(component.currentIndex).toBe(1);
    component.prevArticle();
    expect(component.currentIndex).toBe(0);
    component.nextArticle();
    expect(component.currentIndex).toBe(1);
  });

  it('should start and stop event carousel rotation', () => {
    component.upcomingEvents = [
      { title: 'Event 1', date: '2024-10-01', description: 'Description 1' },
      { title: 'Event 2', date: '2024-10-02', description: 'Description 2' }
    ];
    component.startEventCarouselRotation();
    expect(component.eventIntervalId).toBeDefined();
    component.stopEventCarouselRotation();
    expect(component.eventIntervalId).toBeUndefined();
  });

  it('should navigate events in the carousel', () => {
    component.upcomingEvents = [
      { title: 'Event 1', date: '2024-10-01', description: 'Description 1' },
      { title: 'Event 2', date: '2024-10-02', description: 'Description 2' }
    ];
    component.selectEvent(1);
    expect(component.currentEventIndex).toBe(1);
    component.prevEvent();
    expect(component.currentEventIndex).toBe(0);
    component.nextEvent();
    expect(component.currentEventIndex).toBe(1);
  });
});
