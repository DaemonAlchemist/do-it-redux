export type Status = "Pending" | "Done" | "Blocked" | "Blocker" | "Self Blocked";

export type RecurrencePeriod = "Weekly" | "Monthly" | "Yearly";
export type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export type Month = "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";
export type MonthDay = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31;

export interface IYearDay {
    month: Month;
    day: MonthDay;
}

export interface IRecurrenceBase {
    period: RecurrencePeriod;
    value: WeekDay | MonthDay | IYearDay;
}

export interface IWeeklyRecurrence extends IRecurrenceBase {
    period: "Weekly";
    value: WeekDay;
}

export interface IMonthlyRecurrence extends IRecurrenceBase {
    period: "Monthly";
    value: MonthDay;
}

export interface IYearlyRecurrence extends IRecurrenceBase {
    period: "Yearly";
    value: IYearDay;
}

export type Recurrence = IWeeklyRecurrence | IMonthlyRecurrence | IYearlyRecurrence;

export interface IUser {
    id: string;
    name: string;
}

export interface ITask {
    id: string;
    userId: string;
    description: string;
    status: Status;
    sequence: number;
    reminder?: number;
    recurrence?: Recurrence;
}

export interface ITaskCustomAction {
    srcId: string;
    destSequence: number;
}

export interface IBlocker {
    id: string;
    dependentTaskId: string;
    blockerTaskId: string;
}

export interface IWorkflowTask {
    id: string;
    userId: string;
    description: string;
    dependsOn: string[];
}

export interface IWorkflow {
    id: string;
    description: string;
    params: {
        [name: string]: string;
    };
    tasks: IWorkflowTask[];
}
