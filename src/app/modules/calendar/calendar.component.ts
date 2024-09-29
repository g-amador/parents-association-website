import { Component, HostListener, OnInit } from '@angular/core';
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, isSameMonth, isToday, addMonths } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { EditEventFormDialogComponent } from '../../modules/calendar/edit-event-form-dialog/edit-event-form-dialog.component';
import { Event } from '../../shared/models/event.model';
import { ActivatedRoute } from '@angular/router';
import { ViewEventDialogComponent } from './view-event-dialog/view-event-dialog.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { FirestoreService } from 'src/app/core/services/firestore.service'; // Import Firestore service
import { environment } from 'src/environments/environment'; // Import environment

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

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private firestoreService: FirestoreService // Add Firestore service
  ) { }

  async ngOnInit() {
    this.adjustSidebarVisibility();
    this.generateCalendar();
    await this.loadEvents(); // Ensure events are loaded

    this.route.data.subscribe(data => {
      this.isAdminRoute = this.authService.isAuthenticated();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.adjustSidebarVisibility();
  }

  adjustSidebarVisibility() {
    this.sidebarVisible = window.innerWidth > 768;
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
      // Use LocalStorage to load events
      const storedEvents = await this.localStorageService.getAllEvents();
      if (storedEvents) {
        this.events = storedEvents;
        this.generateCalendar();
      }
    } else {
      // Use Firestore to load events
      this.firestoreService.getEvents().subscribe((storedEvents: Event[]) => {
        this.events = {};
        storedEvents.forEach(event => {
          const dateKey = event.date; // Assuming the event model has a 'date' property
          if (!this.events[dateKey]) {
            this.events[dateKey] = [];
          }
          this.events[dateKey].push(event);
        });
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
        await this.localStorageService.addEvent(eventData.date, newEvent); // Use Local Storage
      } else {
        await this.firestoreService.setEvent(eventData.date, newEvent); // Use Firestore
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
        await this.localStorageService.addEvent(date, updatedEvent); // Use Local Storage
      } else {
        await this.firestoreService.setEvent(date, updatedEvent); // Use Firestore
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
        await this.localStorageService.deleteEvent(date); // Use Local Storage
      } else {
        await this.firestoreService.deleteEvent(date); // Use Firestore
      }

      this.generateCalendar();
    }
  }

  toggleSidebarVisibility(sidebarVisible: boolean): void {
    this.sidebarVisible = sidebarVisible;
  }
}
