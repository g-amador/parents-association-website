import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { AddEventFormDialogComponent } from 'src/app/modules/calendar/edit-event-form-dialog/edit-event-form-dialog.component';
import { Event } from 'src/app/shared/models/event.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  sidebarVisible = true;
  currentMonthYear: moment.Moment = moment();
  calendar: moment.Moment[][] = [];
  events: { [key: string]: Event[] } = {}; // Store events by date

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.generateCalendar();
    this.loadEvents();
  }

  getPublicHolidays(year: number): string[] {
    const publicHolidays = [
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
    return publicHolidays;
  }

  generateCalendar(): void {
    const startOfMonth = moment(this.currentMonthYear).startOf('month');
    const endOfMonth = moment(this.currentMonthYear).endOf('month');

    let calendarRows: moment.Moment[][] = [];
    let day = moment(startOfMonth).startOf('week');

    while (day.isBefore(endOfMonth)) {
      let week: moment.Moment[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(moment(day));
        day.add(1, 'day');
      }
      calendarRows.push(week);
    }

    this.calendar = calendarRows;
    console.log('Calendar generated:', this.calendar);
  }

  moveMonth(offset: number): void {
    this.currentMonthYear.add(offset, 'months');
    this.generateCalendar();
  }

  getDayClasses(day: moment.Moment): string[] {
    const isCurrentMonthYear = day.isSame(this.currentMonthYear, 'month');
    const isToday = day.isSame(moment(), 'day') && day.isSame(this.currentMonthYear, 'month');
    const hasEvents = this.events[day.format('YYYY-MM-DD')] && this.events[day.format('YYYY-MM-DD')].length > 0;

    let classes: string[] = [];
    if (!isCurrentMonthYear) {
      classes.push('inactive');
    } else if (isToday) {
      classes.push('today');
    }

    if (hasEvents) {
      classes.push('has-events');
      console.log('Day with events:', day.format('YYYY-MM-DD'));
    }

    const isHoliday = this.getPublicHolidays(this.currentMonthYear.year()).includes(day.format('YYYY-MM-DD'));
    if (isHoliday) {
      classes.push('holiday');
    }

    return classes;
  }

  selectDate(day: moment.Moment): void {
    const dateStr = day.format('YYYY-MM-DD');
    const eventsForDay = this.events[dateStr] || [];

    console.log('Selected date:', dateStr);
    console.log('Events for selected date:', eventsForDay);

    const dialogRef = this.dialog.open(AddEventFormDialogComponent, {
      width: '400px',
      data: { title: '', date: dateStr, description: '', events: eventsForDay }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);
        if (result.index !== undefined && result.index !== null) {
          this.updateEvent(result);
        } else {
          this.addEvent(result);
        }
      }
    });
  }

  openAddEventFormDialog(): void {
    const dialogRef = this.dialog.open(AddEventFormDialogComponent, {
      width: '400px',
      data: { title: '', date: null, description: '', events: [] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);
        this.addEvent(result);
      }
    });
  }

  addEvent(eventData: { title: string, date: string | null, description: string }): void {
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
      console.log('Event added:', newEvent);
      this.saveEvents();
      this.generateCalendar(); // Update calendar view
    }
  }

  updateEvent(eventData: { title: string, date: string | null, description: string, index: number }): void {
    const { date, title, description, index: eventIndex } = eventData;

    if (date && this.events[date] && eventIndex !== undefined) {
      this.events[date][eventIndex] = { ...this.events[date][eventIndex], title, description };
      console.log('Event updated:', this.events[date][eventIndex]);
      this.saveEvents();
      this.generateCalendar(); // Update calendar view
    }
  }

  saveEvents(): void {
    localStorage.setItem('events', JSON.stringify(this.events));
    console.log('Events saved to localStorage:', this.events);
  }

  loadEvents(): void {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      this.events = JSON.parse(storedEvents);
      console.log('Events loaded from localStorage:', this.events);
      this.generateCalendar(); // Ensure calendar is updated with loaded events
    }
  }

  toggleSidebarVisibility(sidebarVisible: boolean): void {
    this.sidebarVisible = sidebarVisible;
  }
}
