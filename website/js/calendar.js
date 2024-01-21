document.addEventListener('DOMContentLoaded', function () {
    const calendarElement = document.getElementById('calendar');
    let currentMonth = moment();

    function getPublicHolidays(year) {
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

    function generateCalendar() {
        const startOfMonth = moment(currentMonth).startOf('month');
        const endOfMonth = moment(currentMonth).endOf('month');

        let calendarHTML = '<table>';
        calendarHTML += '<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>';

        let day = moment(startOfMonth).startOf('week');
        let dayFormatted = '';

        while (day.isBefore(endOfMonth)) {
            calendarHTML += '<tr>';
            for (let i = 0; i < 7; i++) {
                const isCurrentMonth = day.isSame(startOfMonth, 'month');
                const isToday = day.isSame(moment(), 'day') && day.isSame(currentMonth, 'month');

                let cellClass = '';
                if (!isCurrentMonth) {
                    cellClass = 'inactive';
                } else if (isToday) {
                    cellClass = 'today';
                }

                const isHoliday = getPublicHolidays(currentMonth.format('YYYY')).includes(day.format('YYYY-MM-DD'));
                if (isHoliday) {
                    cellClass += ' holiday';
                }

                calendarHTML += '<td class="' + cellClass + '">' + day.format('D') + '</td>';
                day.add(1, 'day');
            }
            calendarHTML += '</tr>';
        }

        calendarHTML += '</table>';
        calendarElement.innerHTML = calendarHTML;
        document.getElementById('monthText').textContent = currentMonth.format('MMMM YYYY');
    }

    function moveMonth(offset) {
        currentMonth.add(offset, 'months');
        generateCalendar();
    }

    generateCalendar();

    document.getElementById('prevMonth').addEventListener('click', function () {
        moveMonth(-1);
    });

    document.getElementById('nextMonth').addEventListener('click', function () {
        moveMonth(1);
    });
});