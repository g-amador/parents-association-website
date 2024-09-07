import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  sidebarVisible = true;
  currentMonth: moment.Moment = moment(); // Initialize currentMonth
  calendar: moment.Moment[][] = []; // Initialize calendar as an empty array

  ngOnInit() {
    this.generateCalendar();
  }

  // Function to get public holidays
  getPublicHolidays(year: number): string[] {
    const publicHolidays = [
      `${year}-01-01`, // New Year's Day
      `${year}-04-25`, // Freedom Day
      `${year}-05-01`, // Labor Day
      `${year}-06-10`, // Portugal Day
      `${year}-08-15`, // Assumption of Mary
      `${year}-10-05`, // Republic Day
      `${year}-11-01`, // All Saints' Day
      `${year}-12-01`, // Restoration of Independence
      `${year}-12-08`, // Immaculate Conception
      `${year}-12-25`  // Christmas Day
    ];

    return publicHolidays;
  }

  // Function to generate the calendar
  generateCalendar(): void {
    const startOfMonth = moment(this.currentMonth).startOf('month');
    const endOfMonth = moment(this.currentMonth).endOf('month');

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

  // Function to move to the previous or next month
  moveMonth(offset: number): void {
    this.currentMonth.add(offset, 'months');
    this.generateCalendar();
  }

  // Function to get classes for each day cell
  getDayClasses(day: moment.Moment): string[] {
    const isCurrentMonth = day.isSame(this.currentMonth, 'month');
    const isToday = day.isSame(moment(), 'day') && day.isSame(this.currentMonth, 'month');

    let classes: string[] = [];
    if (!isCurrentMonth) {
      classes.push('inactive');
    } else if (isToday) {
      classes.push('today');
    }

    const isHoliday = this.getPublicHolidays(this.currentMonth.year()).includes(day.format('YYYY-MM-DD'));
    if (isHoliday) {
      classes.push('holiday');
    }

    return classes;
  }

  toggleSidebarVisibility(sidebarVisible: boolean) {
    this.sidebarVisible = sidebarVisible;
  }
}
