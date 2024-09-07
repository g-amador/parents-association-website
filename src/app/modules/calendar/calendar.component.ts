import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  sidebarVisible = true;
  currentMonthYear: moment.Moment = moment(); // Initialize currentMonthYear
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

  // Function to move to the previous or next month
  moveMonth(offset: number): void {
    this.currentMonthYear.add(offset, 'months');
    this.generateCalendar();
  }

  // Function to get classes for each day cell
  getDayClasses(day: moment.Moment): string[] {
    const iscurrentMonthYear = day.isSame(this.currentMonthYear, 'month');
    const isToday = day.isSame(moment(), 'day') && day.isSame(this.currentMonthYear, 'month');

    let classes: string[] = [];
    if (!iscurrentMonthYear) {
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

  toggleSidebarVisibility(sidebarVisible: boolean) {
    this.sidebarVisible = sidebarVisible;
    console.log(this.currentMonthYear)
  }
}
