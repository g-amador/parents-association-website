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
  latestArticles: Article[] = []; // Array to hold the latest articles
  upcomingEvents: Event[] = []; // Array to hold upcoming events
  currentIndex = 0; // Current index for the articles carousel
  currentEventIndex = 0; // Current index for the events carousel
  intervalId: any; // ID for the articles carousel interval
  eventIntervalId: any; // ID for the events carousel interval

  private homeService: LocalStorageService | FirestoreService; // Holds the reference to the selected service

  /**
   * Constructor that injects both LocalStorageService and FirestoreService.
   *
   * @param localStorageService Service for accessing local storage data
   * @param firestoreService Service for accessing Firestore data
   */
  constructor(
    private localStorageService: LocalStorageService,
    private firestoreService: FirestoreService
  ) {
    // Decide whether to use FirestoreService or LocalStorageService
    this.homeService = environment.production && !environment.useLocalStorage
      ? this.firestoreService
      : this.localStorageService;
  }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized
   */
  public async ngOnInit() {
    this.adjustSidebarVisibility(); // Adjust sidebar visibility based on screen width
    await this.loadLatestArticles(); // Load latest articles asynchronously
    await this.loadUpcomingEvents(); // Load upcoming events asynchronously
    this.startCarouselRotation(); // Start the article carousel rotation
    this.startEventCarouselRotation(); // Start the event carousel rotation
  }

  /**
   * Adjusts the visibility of the sidebar based on the window width
   */
  public adjustSidebarVisibility() {
    this.sidebarVisible = window.innerWidth > 768; // Adjust the breakpoint as needed
  }

  /**
   * Toggles the visibility of the sidebar
   * @param sidebarVisible Boolean indicating the desired visibility state
   */
  public toggleSidebarVisibility(sidebarVisible: boolean) {
    this.sidebarVisible = sidebarVisible; // Set the sidebar visibility state
  }

  /**
   * Load the latest articles using the selected service
   */
  public async loadLatestArticles() {
    if (environment.production && !environment.useLocalStorage) {
      // FirestoreService returns an Observable; we need to subscribe
      (this.homeService.getAllArticles() as Observable<Article[]>).subscribe(
        articles => {
          this.latestArticles = articles.slice(-3).reverse(); // Get the last 3 articles in reverse order
        },
        error => {
          console.error('Error loading articles from Firestore:', error); // Log any errors encountered
        }
      );
    } else {
      // LocalStorageService returns data directly as an array
      this.latestArticles = (this.homeService.getAllArticles() as Article[]).slice(-3).reverse();
    }
  }

  /**
   * Load upcoming events using the selected service
   */
  public async loadUpcomingEvents() {
    if (environment.production && !environment.useLocalStorage) {
      // FirestoreService returns an Observable; we need to subscribe
      (this.homeService.getAllEvents() as Observable<Event[]>).subscribe(
        events => {
          this.processEvents(events); // Pass the array directly to processEvents
        },
        error => {
          console.error('Error loading events from Firestore:', error); // Log any errors encountered
        }
      );
    } else {
      // LocalStorageService returns data directly as an object
      try {
        const events = await (this.homeService as LocalStorageService).getAllEvents(); // Await the promise
        this.processEvents(events); // Pass the object directly to processEvents
      } catch (error) {
        console.error('Error loading events from Local Storage:', error); // Log any errors encountered
      }
    }
  }

  /**
   * Processes the events data and updates the upcomingEvents array
   * @param events Array of events or object containing events
   */
  public processEvents(events: Event[] | { [key: string]: Event[] }) {
    if (Array.isArray(events)) {
      // Handle Firestore events
      this.upcomingEvents = events.slice(0, 3); // Limit to next 3 events
    } else {
      // Handle LocalStorage events
      const transformedEvents = Object.keys(events).flatMap(key => {
        return events[key].map(event => ({ ...event, date: key })); // Transform events to include date
      });

      // Sort and filter events
      this.upcomingEvents = transformedEvents
        .filter(event => new Date(event.date) >= new Date()) // Filter past events
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date
        .slice(0, 3); // Limit to next 3 events
    }
  }

  /**
   * Starts the rotation of the articles carousel
   */
  public startCarouselRotation() {
    if (this.latestArticles.length > 0) {
      this.intervalId = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.latestArticles.length; // Rotate to the next article
      }, 5000); // Change every 5 seconds
    }
  }

  /**
   * Stops the rotation of the articles carousel
   */
  public stopCarouselRotation() {
    clearInterval(this.intervalId); // Clear the interval
  }

  /**
   * Selects a specific article in the carousel
   * @param index The index of the article to select
   */
  public selectArticle(index: number) {
    this.stopCarouselRotation(); // Stop the rotation
    this.currentIndex = index; // Set the current index to the selected article
    this.startCarouselRotation(); // Restart the rotation
  }

  /**
   * Moves to the previous article in the carousel
   */
  public prevArticle() {
    this.stopCarouselRotation(); // Stop the rotation
    this.currentIndex = (this.currentIndex - 1 + this.latestArticles.length) % this.latestArticles.length; // Move to previous article
    this.startCarouselRotation(); // Restart the rotation
  }

  /**
   * Moves to the next article in the carousel
   */
  public nextArticle() {
    this.stopCarouselRotation(); // Stop the rotation
    this.currentIndex = (this.currentIndex + 1) % this.latestArticles.length; // Move to next article
    this.startCarouselRotation(); // Restart the rotation
  }

  /**
   * Starts the rotation of the events carousel
   */
  public startEventCarouselRotation() {
    if (this.upcomingEvents.length > 0) {
      this.eventIntervalId = setInterval(() => {
        this.currentEventIndex = (this.currentEventIndex + 1) % this.upcomingEvents.length; // Rotate to the next event
      }, 5000); // Change every 5 seconds
    }
  }

  /**
   * Stops the rotation of the events carousel
   */
  public stopEventCarouselRotation() {
    clearInterval(this.eventIntervalId); // Clear the interval
  }

  /**
   * Selects a specific event in the carousel
   * @param index The index of the event to select
   */
  public selectEvent(index: number) {
    this.stopEventCarouselRotation(); // Stop the rotation
    this.currentEventIndex = index; // Set the current index to the selected event
    this.startEventCarouselRotation(); // Restart the rotation
  }

  /**
   * Moves to the previous event in the events carousel
   */
  public prevEvent() {
    this.stopEventCarouselRotation(); // Stop the rotation
    this.currentEventIndex = (this.currentEventIndex - 1 + this.upcomingEvents.length) % this.upcomingEvents.length; // Move to previous event
    this.startEventCarouselRotation(); // Restart the rotation
  }

  /**
   * Moves to the next event in the events carousel
   */
  public nextEvent() {
    this.stopEventCarouselRotation(); // Stop the rotation
    this.currentEventIndex = (this.currentEventIndex + 1) % this.upcomingEvents.length; // Move to next event
    this.startEventCarouselRotation(); // Restart the rotation
  }
}
