import { Component, OnInit } from '@angular/core';
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, isSameMonth, isToday, addMonths } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { EditEventFormDialogComponent } from '../../modules/calendar/edit-event-form-dialog/edit-event-form-dialog.component';
import { Event } from '../../shared/models/event.model';
import { ActivatedRoute } from '@angular/router';
import { ViewEventDialogComponent } from './view-event-dialog/view-event-dialog.component';
import { AuthService } from '../../core/services/auth.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { FirestoreService } from '../../core/services/firestore.service'; // Import Firestore service
import { environment } from '../../../environments/environment'; // Import environment

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  sidebarVisible = true;
  currentMonthYear: Date = new Date();
  calendar: Date[][] = [];
  events: { [key: string]: Event[] } = {};
  isAdminRoute: boolean = false;

  private eventService: LocalStorageService | FirestoreService; // Dynamic service based on environment

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private firestoreService: FirestoreService
  ) {
    // Decide which service to use based on environment
    this.eventService = environment.production && !environment.useLocalStorage
      ? this.firestoreService
      : this.localStorageService;
  }

  async ngOnInit() {
    // Ensure the sidebar adjusts to window size
    this.adjustSidebarVisibility();

    // Generate the initial calendar structure without events
    this.generateCalendar();

    // Load events from storage (localStorage or Firestore)
    await this.loadEvents(); // Make sure this waits until events are fully loaded

    // Regenerate the calendar with events loaded
    this.generateCalendar();

    // Check if the user is on an admin route
    this.route.data.subscribe(data => {
      this.isAdminRoute = this.authService.isAuthenticated();
    });
  }

  adjustSidebarVisibility() {
    this.sidebarVisible = window.innerWidth > 768; // Adjust the breakpoint as needed
  }

  getPublicHolidays(year: number): string[] {
    return [
      `${year}-01-01`,
      `${year}-04-25`,
      `${year}-05-01`,
      `${year}-06-10`,
      `${year}-08-15`,
      `${year}-10-05`,
      `${year}-11-01`,
      `${year}-12-01`,
      `${year}-12-08`,
      `${year}-12-25`
    ];
  }

  generateCalendar(): void {
    const startOfCurrentMonth = startOfMonth(this.currentMonthYear);
    const endOfCurrentMonth = endOfMonth(this.currentMonthYear);

    let calendarRows: Date[][] = [];
    let day = startOfWeek(startOfCurrentMonth);

    while (day <= endOfCurrentMonth) {
      let week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(day);
        day = addDays(day, 1);
      }
      calendarRows.push(week);
    }

    this.calendar = calendarRows;
  }

  moveMonth(offset: number): void {
    this.currentMonthYear = addMonths(this.currentMonthYear, offset);
    this.generateCalendar();
  }

  getDayClasses(day: Date): string[] {
    const isCurrentMonth = isSameMonth(day, this.currentMonthYear);
    const today = isToday(day);
    const hasEvents = this.events[format(day, 'yyyy-MM-dd')] && this.events[format(day, 'yyyy-MM-dd')].length > 0;

    let classes: string[] = [];
    if (!isCurrentMonth) {
      classes.push('inactive');
    }
    if (today) {
      classes.push('today');
    }
    if (hasEvents) {
      classes.push('has-events');
    }

    const isHoliday = this.getPublicHolidays(this.currentMonthYear.getFullYear()).includes(format(day, 'yyyy-MM-dd'));
    if (isHoliday) {
      classes.push('holiday');
    }

    return classes;
  }

  selectDate(day: Date): void {
    const dateStr = format(day, 'yyyy-MM-dd');
    const eventsForDay = this.events[dateStr] || [];

    if (this.isAdminRoute) {
      const dialogRef = this.dialog.open(EditEventFormDialogComponent, {
        width: '500px',
        data: { title: '', date: dateStr, description: '', events: eventsForDay }
      });

      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          if (result.cancel) {
            await this.deleteEvent(result.date, result.index);
          } else if (result.index !== undefined && result.index !== null) {
            await this.updateEvent(result);
          } else {
            await this.addEvent(result);
          }

          this.generateCalendar();
        }
      });
    } else {
      const event = eventsForDay.length > 0 ? eventsForDay[0] : { title: 'calendar_page.event.no_events', description: '' };
      this.dialog.open(ViewEventDialogComponent, {
        width: '300px',
        data: event
      });
    }
  }

  async loadEvents(): Promise<void> {
    if (environment.useLocalStorage) {
      // Load events from LocalStorage
      const storedEvents = await (this.eventService as LocalStorageService).getAllEvents();
      if (storedEvents) {
        // Set the fetched events to the component's `events` object
        this.events = storedEvents;

        // Make sure to regenerate the calendar with the new events data
        this.generateCalendar();
      }
    } else {
      // Load events from Firestore if LocalStorage is not used
      (this.eventService as FirestoreService).getAllEvents().subscribe((storedEvents: Event[]) => {
        this.events = {};

        // Map the events to their corresponding dates
        storedEvents.forEach(event => {
          const dateKey = event.date;
          if (!this.events[dateKey]) {
            this.events[dateKey] = [];
          }
          this.events[dateKey].push(event);
        });

        // Refresh the calendar once Firestore events are loaded
        this.generateCalendar();
      });
    }
  }

  async addEvent(eventData: { title: string; date: string | null; description: string }): Promise<void> {
    if (eventData.title && eventData.date) {
      const newEvent: Event = {
        title: eventData.title,
        date: eventData.date,
        description: eventData.description
      };

      if (!this.events[eventData.date]) {
        this.events[eventData.date] = [];
      }
      this.events[eventData.date].push(newEvent);

      if (environment.useLocalStorage) {
        await this.eventService.setEvent(eventData.date, newEvent); // Use Local Storage
      } else {
        await this.eventService.setEvent(eventData.date, newEvent); // Use Firestore
      }

      this.generateCalendar();
    }
  }

  async updateEvent(eventData: { title: string; date: string | null; description: string; index: number }): Promise<void> {
    const { date, title, description, index: eventIndex } = eventData;

    if (date && this.events[date] && eventIndex !== undefined) {
      const updatedEvent = { ...this.events[date][eventIndex], title, description };
      const eventsCopy = [...this.events[date]];
      eventsCopy[eventIndex] = updatedEvent;
      this.events[date] = eventsCopy;

      if (environment.useLocalStorage) {
        await this.eventService.setEvent(date, updatedEvent); // Use Local Storage
      } else {
        await this.eventService.setEvent(date, updatedEvent); // Use Firestore
      }

      this.generateCalendar();
    }
  }

  async deleteEvent(date: string, index: number): Promise<void> {
    if (date && this.events[date] && index !== undefined) {
      const eventsForDate = this.events[date];
      eventsForDate.splice(index, 1); // Remove the event from the list

      if (eventsForDate.length === 0) {
        delete this.events[date]; // Remove the date key if no events remain
      }

      if (environment.useLocalStorage) {
        await this.eventService.deleteEvent(date); // Use Local Storage
      } else {
        await this.eventService.deleteEvent(date); // Use Firestore
      }

      this.generateCalendar();
    }
  }

  toggleSidebarVisibility(sidebarVisible: boolean): void {
    this.sidebarVisible = sidebarVisible;
  }
}
