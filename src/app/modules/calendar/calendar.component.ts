import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
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
  eventTitle = '';
  eventDate: string | null = null;
  eventDescription = '';

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
  }

  moveMonth(offset: number): void {
    this.currentMonthYear.add(offset, 'months');
    this.generateCalendar();
  }

  getDayClasses(day: moment.Moment): string[] {
    const isCurrentMonthYear = day.isSame(this.currentMonthYear, 'month');
    const isToday = day.isSame(moment(), 'day') && day.isSame(this.currentMonthYear, 'month');

    let classes: string[] = [];
    if (!isCurrentMonthYear) {
      classes.push('inactive');
    } else if (isToday) {
      classes.push('today');
    }

    const isHoliday = this.getPublicHolidays(this.currentMonthYear.year()).includes(day.format('YYYY-MM-DD'));
    if (isHoliday) {
      classes.push('holiday');
    }

    return classes;
  }

  selectDate(day: moment.Moment): void {
    // Handle date selection if needed
  }

  addEvent(): void {
    if (this.eventTitle && this.eventDate) {
      const newEvent: Event = {
        title: this.eventTitle,
        date: this.eventDate,
        description: this.eventDescription
      };

      if (!this.events[this.eventDate]) {
        this.events[this.eventDate] = [];
      }
      this.events[this.eventDate].push(newEvent);
      this.saveEvents();
      this.resetForm();
      this.generateCalendar(); // Update calendar view if needed
    }
  }

  saveEvents(): void {
    localStorage.setItem('events', JSON.stringify(this.events));
  }

  loadEvents(): void {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      this.events = JSON.parse(storedEvents);
    }
  }

  resetForm(): void {
    this.eventTitle = '';
    this.eventDate = null;
    this.eventDescription = '';
  }

  toggleSidebarVisibility(sidebarVisible: boolean): void {
    this.sidebarVisible = sidebarVisible;
  }
}
