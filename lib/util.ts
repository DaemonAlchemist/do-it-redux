import { Recurrence, MonthDay, IYearlyRecurrence, IMonthlyRecurrence } from "./types";
import { switchOn } from "ts-functional";

const weekDayIndex:{[id:string]: number} = {Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6};
const monthIndex:{[id:string]: number} = {Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11};

export const getRecurrenceDate = (curDate:Date, recurrence:Recurrence):Date => switchOn(recurrence.period, {
    "Weekly": () => {
        const dayOfWeek = curDate.getDay();
        const targetDayOfWeek = weekDayIndex[recurrence.value as string];
        const offset = targetDayOfWeek > dayOfWeek
            ? targetDayOfWeek - dayOfWeek
            : targetDayOfWeek - dayOfWeek + 7;
        const newDate = new Date(curDate);
        newDate.setDate(curDate.getDate() + offset);
        return newDate;
    },
    "Monthly": () => {
        const r:IMonthlyRecurrence = recurrence as IMonthlyRecurrence;
        const daysInMonth:MonthDay = new Date(curDate.getFullYear(), curDate.getMonth() + 1, 0).getDate() as MonthDay;
        const daysInNextMonth:MonthDay = new Date(curDate.getFullYear(), curDate.getMonth() + 2, 0).getDate() as MonthDay;
        const recurrenceThisMonth:Date = new Date(curDate.getFullYear(), curDate.getMonth(), r.value > daysInMonth ? daysInMonth : recurrence.value as number);
        const recurrenceNextMonth:Date = new Date(curDate.getFullYear(), curDate.getMonth() + 1, r.value > daysInNextMonth ? daysInNextMonth : recurrence.value as number);

        return curDate.valueOf() < recurrenceThisMonth.valueOf() ? recurrenceThisMonth : recurrenceNextMonth;
    },
    "Yearly": () => {
        const r:IYearlyRecurrence = recurrence as IYearlyRecurrence;
        const daysInMonth:MonthDay = new Date(curDate.getFullYear(), monthIndex[r.value.month] + 1, 0).getDate() as MonthDay;
        const daysInNextMonth:MonthDay = new Date(curDate.getFullYear(), monthIndex[r.value.month] + 2, 0).getDate() as MonthDay;
        const recurrenceThisYear:Date = new Date(curDate.getFullYear(),     monthIndex[r.value.month], r.value.day > daysInMonth ? daysInMonth : r.value.day);
        const recurrenceNextYear:Date = new Date(curDate.getFullYear() + 1, monthIndex[r.value.month], r.value.day > daysInNextMonth ? daysInNextMonth : r.value.day);

        return curDate.valueOf() < recurrenceThisYear.valueOf() ? recurrenceThisYear : recurrenceNextYear;
    },
    default: () => new Date(curDate),
}) || new Date(curDate);
