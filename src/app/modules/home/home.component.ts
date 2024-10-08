import { Component, OnInit } from '@angular/core';
import { Article } from '../../shared/models/article.model';
import { Event } from '../../shared/models/event.model';
import { LocalStorageService } from '../../core/services/local-storage.service'; // Import Local Storage Service
import { FirestoreService } from '../../core/services/firestore.service'; // Import Firestore Service
import { environment } from '../../../environments/environment'; // Import environment
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  sidebarVisible = true; // Default to true, will adjust based on screen size
  latestArticles: Article[] = [];
  upcomingEvents: Event[] = [];
  currentIndex = 0;
  currentEventIndex = 0; // For events carousel
  intervalId: any;
  eventIntervalId: any; // For event carousel rotation

  private homeService: LocalStorageService | FirestoreService; // To hold the reference to the selected service

  // Inject both LocalStorageService and FirestoreService
  constructor(
    private localStorageService: LocalStorageService,
    private firestoreService: FirestoreService
  ) {
    // Decide whether to use FirestoreService or LocalStorageService
    this.homeService = environment.production && !environment.useLocalStorage
      ? this.firestoreService
      : this.localStorageService;
  }

  async ngOnInit() {
    this.adjustSidebarVisibility();
    await this.loadLatestArticles(); // Load latest articles asynchronously
    await this.loadUpcomingEvents(); // Load upcoming events asynchronously
    this.startCarouselRotation();
    this.startEventCarouselRotation(); // Start event carousel rotation
  }

  adjustSidebarVisibility() {
    this.sidebarVisible = window.innerWidth > 768; // Adjust the breakpoint as needed
  }

  toggleSidebarVisibility(sidebarVisible: boolean) {
    this.sidebarVisible = sidebarVisible;
  }

  // Load the latest articles using the selected service
  async loadLatestArticles() {
    if (environment.production && !environment.useLocalStorage) {
      // FirestoreService returns an Observable, we need to subscribe
      (this.homeService.getAllArticles() as Observable<Article[]>).subscribe(
        articles => {
          this.latestArticles = articles.slice(-3).reverse(); // Get the last 3 articles in reverse order
        },
        error => {
          console.error('Error loading articles from Firestore:', error);
        }
      );
    } else {
      // LocalStorageService returns data directly as an array
      this.latestArticles = (this.homeService.getAllArticles() as Article[]).slice(-3).reverse();
    }
  }

  // Load upcoming events using the selected service
  async loadUpcomingEvents() {
    if (environment.production && !environment.useLocalStorage) {
      // FirestoreService returns an Observable, we need to subscribe
      (this.homeService.getAllEvents() as Observable<Event[]>).subscribe(
        events => {
          this.processEvents(events); // Pass the array directly to processEvents
        },
        error => {
          console.error('Error loading events from Firestore:', error);
        }
      );
    } else {
      // LocalStorageService returns data directly as an object
      try {
        const events = await this.localStorageService.getAllEvents(); // Await the promise
        this.processEvents(events); // Pass the object directly to processEvents
      } catch (error) {
        console.error('Error loading events from Local Storage:', error);
      }
    }
  }

  processEvents(events: Event[] | { [key: string]: Event[] }) {
    if (Array.isArray(events)) {
      // Handle Firestore events
      this.upcomingEvents = events.slice(0, 3); // Limit to next 3 events
    } else {
      // Handle LocalStorage events
      const transformedEvents = Object.keys(events).flatMap(key => {
        return events[key].map(event => ({ ...event, date: key }));
      });

      // Sort and filter events just like before
      this.upcomingEvents = transformedEvents
        .filter(event => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3); // Limit to next 3 events
    }
  }

  startCarouselRotation() {
    if (this.latestArticles.length > 0) {
      this.intervalId = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.latestArticles.length;
      }, 5000); // Change every 5 seconds
    }
  }

  stopCarouselRotation() {
    clearInterval(this.intervalId);
  }

  selectArticle(index: number) {
    this.stopCarouselRotation();
    this.currentIndex = index;
    this.startCarouselRotation();
  }

  prevArticle() {
    this.stopCarouselRotation();
    this.currentIndex = (this.currentIndex - 1 + this.latestArticles.length) % this.latestArticles.length;
    this.startCarouselRotation();
  }

  nextArticle() {
    this.stopCarouselRotation();
    this.currentIndex = (this.currentIndex + 1) % this.latestArticles.length;
    this.startCarouselRotation();
  }

  // Event Carousel Methods
  startEventCarouselRotation() {
    if (this.upcomingEvents.length > 0) {
      this.eventIntervalId = setInterval(() => {
        this.currentEventIndex = (this.currentEventIndex + 1) % this.upcomingEvents.length;
      }, 5000); // Change every 5 seconds
    }
  }

  stopEventCarouselRotation() {
    clearInterval(this.eventIntervalId);
  }

  selectEvent(index: number) {
    this.stopEventCarouselRotation();
    this.currentEventIndex = index;
    this.startEventCarouselRotation();
  }

  prevEvent() {
    this.stopEventCarouselRotation();
    this.currentEventIndex = (this.currentEventIndex - 1 + this.upcomingEvents.length) % this.upcomingEvents.length;
    this.startEventCarouselRotation();
  }

  nextEvent() {
    this.stopEventCarouselRotation();
    this.currentEventIndex = (this.currentEventIndex + 1) % this.upcomingEvents.length;
    this.startEventCarouselRotation();
  }
}
