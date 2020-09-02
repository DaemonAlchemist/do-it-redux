"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_functional_1 = require("ts-functional");
var weekDayIndex = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
var monthIndex = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
exports.getRecurrenceDate = function (curDate, recurrence) { return ts_functional_1.switchOn(recurrence.period, {
    "Weekly": function () {
        var dayOfWeek = curDate.getDay();
        var targetDayOfWeek = weekDayIndex[recurrence.value];
        var offset = targetDayOfWeek > dayOfWeek
            ? targetDayOfWeek - dayOfWeek
            : targetDayOfWeek - dayOfWeek + 7;
        var newDate = new Date(curDate);
        newDate.setDate(curDate.getDate() + offset);
        return newDate;
    },
    "Monthly": function () {
        var r = recurrence;
        var daysInMonth = new Date(curDate.getFullYear(), curDate.getMonth() + 1, 0).getDate();
        var daysInNextMonth = new Date(curDate.getFullYear(), curDate.getMonth() + 2, 0).getDate();
        var recurrenceThisMonth = new Date(curDate.getFullYear(), curDate.getMonth(), r.value > daysInMonth ? daysInMonth : recurrence.value);
        var recurrenceNextMonth = new Date(curDate.getFullYear(), curDate.getMonth() + 1, r.value > daysInNextMonth ? daysInNextMonth : recurrence.value);
        return curDate.valueOf() < recurrenceThisMonth.valueOf() ? recurrenceThisMonth : recurrenceNextMonth;
    },
    "Yearly": function () {
        var r = recurrence;
        var daysInMonth = new Date(curDate.getFullYear(), monthIndex[r.value.month] + 1, 0).getDate();
        var daysInNextMonth = new Date(curDate.getFullYear(), monthIndex[r.value.month] + 2, 0).getDate();
        var recurrenceThisYear = new Date(curDate.getFullYear(), monthIndex[r.value.month], r.value.day > daysInMonth ? daysInMonth : r.value.day);
        var recurrenceNextYear = new Date(curDate.getFullYear() + 1, monthIndex[r.value.month], r.value.day > daysInNextMonth ? daysInNextMonth : r.value.day);
        return curDate.valueOf() < recurrenceThisYear.valueOf() ? recurrenceThisYear : recurrenceNextYear;
    },
    default: function () { return new Date(curDate); },
}) || new Date(curDate); };
