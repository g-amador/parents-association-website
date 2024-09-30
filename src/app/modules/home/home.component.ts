import { Component, OnInit, HostListener } from '@angular/core';
import { Article } from '../../shared/models/article.model';
import { Event } from '../../shared/models/event.model';
import { LocalStorageService } from '../../core/services/local-storage.service'; // Import Local Storage Service

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

  constructor(private localStorageService: LocalStorageService) { } // Inject LocalStorageService

  async ngOnInit() {
    this.adjustSidebarVisibility();
    await this.loadLatestArticles(); // Load latest articles asynchronously
    await this.loadUpcomingEvents(); // Load upcoming events asynchronously
    this.startCarouselRotation();
    this.startEventCarouselRotation(); // Start event carousel rotation
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.adjustSidebarVisibility();
  }

  adjustSidebarVisibility() {
    this.sidebarVisible = window.innerWidth > 768; // Adjust the breakpoint as needed
  }

  toggleSidebarVisibility(sidebarVisible: boolean) {
    this.sidebarVisible = sidebarVisible;
  }

  // Load the latest articles using LocalStorageService
  async loadLatestArticles() {
    this.latestArticles = await this.localStorageService.getAllArticles(); // Load articles from Local Storage
    this.latestArticles = this.latestArticles.slice(-3).reverse(); // Get the last 3 articles in reverse order
  }

  // Load upcoming events using LocalStorageService
  async loadUpcomingEvents() {
    const events = await this.localStorageService.getAllEvents();

    if (events && typeof events === 'object') {
      // Transform the object with event keys into a flat array of event objects
      const transformedEvents = Object.keys(events).flatMap(key => {
        const eventList = events[key]; // Get events for that date
        if (Array.isArray(eventList)) {
          return eventList.map(event => ({
            ...event,
            date: key
          }));
        }
        return []; // Skip non-event keys
      });

      // Filter out past events and sort by date
      const sortedTransformedEvents = transformedEvents
        .filter(event => event.date && new Date(event.date) >= new Date()) // Filter out past events
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort events by date

      this.upcomingEvents = sortedTransformedEvents.slice(0, 3); // Get the next 3 upcoming events
    } else {
      this.upcomingEvents = [];
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
