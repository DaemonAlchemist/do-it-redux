import { combineReducers } from "redux";
import { IEntityState, theReducer } from "the-reducer";
import { taskDef } from "./entityDefs";
import { blocker, task, user, workflow } from "./redux";
import { ITask, IWorkflow, MonthDay, WeekDay, Recurrence } from "./types";
import { getRecurrenceDate } from "./util";
import { addTask, removeParam, removeTask, updateDescription, updateParam, updateTaskDependencies, updateTaskDescription, updateTaskId, updateTaskUser } from './workflow';

const origWorkflow:IWorkflow = {
    description: "Test Description",
    id: "test",
    params: {
        test: "Test Param",
        another: "Another Param",
    },
    tasks: [
        {id: "test", description: "Test task", userId: "Andy", dependsOn: []},
        {id: "test2", description: "Test2 task", userId: "Andrea", dependsOn: ["test"]},
        {id: "test3", description: "Test3 task", userId: "Gemma", dependsOn: ["tes2"]},
    ],
}

const reducer = combineReducers({
    theReducerEntities:  theReducer.entity(user, task, blocker, workflow),
});

const initialState = {
    theReducerEntities: {}
};

describe("basic redux", () => {
    it("should add tasks", () => {
        const store:any = [
            task.add({id: "1", description: "Task 1", userId: "Andy"}),
        ].reduce(reducer, initialState);

        expect(task.get(store, "1").description).toEqual("Task 1");
    });
    it("should save task recurrence values", () => {
        const store:any = [
            task.add({id: "1", description: "Task 1", userId: "Andy", recurrence: {period: "Weekly", value: "Mon"}}),
        ].reduce(reducer, initialState);

        expect(task.get(store, "1").recurrence?.period).toEqual("Weekly");
        expect(task.get(store, "1").recurrence?.value).toEqual("Mon");
    });
});

describe("utility function", () => {
    describe("getRecurrenceDate", () => {
        it("should return the next recurrence date", () => {
            const dates:Array<{cur: string, next: string, recurrence: Recurrence}> = [
                {cur: "September 29, 2020", next: "October 5, 2020",    recurrence: {period: "Weekly", value: "Mon"}},
                {cur: "September 29, 2020", next: "October 6, 2020",    recurrence: {period: "Weekly", value: "Tue"}},
                {cur: "September 29, 2020", next: "September 30, 2020", recurrence: {period: "Weekly", value: "Wed"}},
                {cur: "December 30, 2020",  next: "January 5, 2021",    recurrence: {period: "Weekly", value: "Tue"}},

                {cur: "September 29, 2020", next: "October 15, 2020",   recurrence: {period: "Monthly", value: 15}},
                {cur: "September 10, 2020", next: "September 15, 2020", recurrence: {period: "Monthly", value: 15}},
                {cur: "September 29, 2020", next: "October 29, 2020",   recurrence: {period: "Monthly", value: 29}},
                {cur: "December 20, 2020",  next: "January 10, 2021",   recurrence: {period: "Monthly", value: 10}},
                {cur: "February 27, 2021",  next: "February 28, 2021",  recurrence: {period: "Monthly", value: 30}},
                {cur: "February 28, 2020",  next: "February 29, 2020",  recurrence: {period: "Monthly", value: 30}},
                {cur: "February 29, 2020",  next: "March 30, 2020",     recurrence: {period: "Monthly", value: 30}},
                {cur: "January 30, 2020",   next: "February 29, 2020",  recurrence: {period: "Monthly", value: 30}},
                {cur: "January 31, 2020",   next: "February 29, 2020",  recurrence: {period: "Monthly", value: 30}},

                {cur: "January 2, 2020", next: "January 2, 2021", recurrence: {period: "Yearly", value: {month: "Jan", day: 2}}},
                {cur: "January 2, 2020", next: "February 3, 2020", recurrence: {period: "Yearly", value: {month: "Feb", day: 3}}},
                {cur: "February 2, 2020", next: "January 2, 2021", recurrence: {period: "Yearly", value: {month: "Jan", day: 2}}},
                {cur: "January 2, 2020", next: "February 29, 2020", recurrence: {period: "Yearly", value: {month: "Feb", day: 29}}},
                {cur: "January 2, 2021", next: "February 28, 2021", recurrence: {period: "Yearly", value: {month: "Feb", day: 29}}},
            ]
            dates.forEach((test) => {
                const today = new Date(test.cur);
                const next = new Date(test.next);
                const recur = getRecurrenceDate(today, test.recurrence);

                expect(recur.toDateString()).toEqual(next.toDateString());
            });
        });
    });
});

describe("workflow utility functions", () => {
    describe("updateDescription", () => {
        it("should update the description" , () => {
            const newWorkflow = updateDescription(origWorkflow, "New description");
            expect(newWorkflow.id).toEqual("test");
            expect(newWorkflow.description).toEqual("New description");
        });
    });
    describe("updateParam", () => {
        it("should update an existing param name", () => {
            const newWorkflow = updateParam(origWorkflow, "test", "New Test Param");
            expect(newWorkflow.params.test).toEqual("New Test Param");
        });
        it("should add new params", () => {
            const newWorkflow = updateParam(origWorkflow, "test2", "New Test Param");
            expect(newWorkflow.params.test).toEqual("Test Param");
            expect(newWorkflow.params.test2).toEqual("New Test Param");
        });
    });
    describe("remove param", () => {
        it("should remove a parameter", () => {
            const newWorkflow = removeParam(origWorkflow, "another");
            expect(newWorkflow.params.test).toEqual("Test Param");
            expect(newWorkflow.params.another).toBeUndefined();
        })
    });
    describe("addTask", () => {
        it("should add a task", () => {
            const newWorkflow = addTask(
                origWorkflow,
                {id: "newTask", description: "New Task", userId: "Gemma", dependsOn: ["test", "test2"]}
            );
            expect(newWorkflow.tasks.length).toEqual(4);
            expect(newWorkflow.tasks[3].id).toEqual("newTask");
            expect(newWorkflow.tasks[3].dependsOn).toEqual(["test", "test2"]);
        });
        it("should remove dependencies on non-existent tasks", () => {
            const newWorkflow = addTask(
                origWorkflow,
                {id: "newTask", description: "New Task", userId: "Gemma", dependsOn: ["test", "test4"]}
            );
            expect(newWorkflow.tasks[3].id).toEqual("newTask");
            expect(newWorkflow.tasks[3].dependsOn).toEqual(["test"]);
        });
    });
    describe("removeTask", () => {
        it("should remove a task", () => {
            const newWorkflow = removeTask(origWorkflow, "test2");
            expect(newWorkflow.tasks.length).toEqual(2);
            expect(newWorkflow.tasks[0].id).toEqual("test");
        });
        it("should remove dependencies that point to the removed task", () => {
            const newWorkflow = removeTask(origWorkflow, "test");
            expect(newWorkflow.tasks[0].id).toEqual("test2");
            expect(newWorkflow.tasks[0].dependsOn).toEqual([]);
        });
    });
    describe("updateTaskId", () => {
        it("should update a task's id and dependencies that point to it", () => {
            const newWorkflow = updateTaskId(origWorkflow, "test", "newTest");
            expect(newWorkflow.tasks[0].id).toEqual("newTest");
            expect(newWorkflow.tasks[1].id).toEqual("test2");
            expect(newWorkflow.tasks[1].dependsOn).toEqual(["newTest"]);
        })
    });
    describe("updateTaskDescription", () => {
        it("should update a task's description", () => {
            const newWorkflow = updateTaskDescription(origWorkflow, "test", "New description");
            expect(newWorkflow.tasks[0].description).toEqual("New description");
            expect(newWorkflow.tasks[1].description).toEqual("Test2 task");
        });
    });
    describe("updateTaskUser", () => {
        it("should update a task's user", () => {
            const newWorkflow = updateTaskUser(origWorkflow, "test", "Seta");
            expect(newWorkflow.tasks[0].userId).toEqual("Seta");
            expect(newWorkflow.tasks[1].userId).toEqual("Andrea");
        });
    });
    describe("updateTaskDependencies", () => {
        it("should update a task's dependencies", () => {
            const newWorkflow = updateTaskDependencies(origWorkflow, "test2", ["test3"]);
            expect(newWorkflow.tasks[0].dependsOn).toEqual([]);
            expect(newWorkflow.tasks[1].dependsOn).toEqual(["test3"]);
        });
        it("should remove dependencies on non-existent tasks", () => {
            const newWorkflow = updateTaskDependencies(origWorkflow, "test2", ["test3", "test4"]);
            expect(newWorkflow.tasks[0].dependsOn).toEqual([]);
            expect(newWorkflow.tasks[1].dependsOn).toEqual(["test3"]);
        });
    });
});

describe("task resequencing", () => {
    it("should resequence tasks up", () => {
        const tasks:IEntityState<ITask> = {
            task1: {id: "task1", description: "Task 1", status: "Pending", sequence: -5, userId: "User 1"},
            task2: {id: "task2", description: "Task 2", status: "Pending", sequence: 10, userId: "User 2"},
            task3: {id: "task3", description: "Task 3", status: "Pending", sequence: 20, userId: "User 3"},
            task4: {id: "task4", description: "Task 4", status: "Pending", sequence: 40, userId: "User 4"},
        }
    
        const movedTasks = taskDef.customReducer.resequence(tasks, {srcId: "task3", destSequence: 1});
    
        expect(movedTasks.task1.sequence).toEqual(0);
        expect(movedTasks.task3.sequence).toEqual(1);
        expect(movedTasks.task2.sequence).toEqual(2);
        expect(movedTasks.task4.sequence).toEqual(3);
    });

    it("should resequence up to after the destination task", () => {
        const tasks:IEntityState<ITask> = {
            task1: {id: "task1", description: "Task 1", status: "Pending", sequence: 1, userId: "User 1"},
            task2: {id: "task2", description: "Task 2", status: "Pending", sequence: 2, userId: "User 2"},
            task3: {id: "task3", description: "Task 3", status: "Pending", sequence: 3, userId: "User 3"},
            task4: {id: "task4", description: "Task 4", status: "Pending", sequence: 4, userId: "User 4"},
        }
    
        const movedTasks = taskDef.customReducer.resequence(tasks, {srcId: "task3", destSequence: 1, mode: "after"});
    
        expect(movedTasks.task1.sequence).toEqual(0);
        expect(movedTasks.task3.sequence).toEqual(1);
        expect(movedTasks.task2.sequence).toEqual(2);
        expect(movedTasks.task4.sequence).toEqual(3);
    });

    it("should resequence tasks down", () => {
        const tasks:IEntityState<ITask> = {
            task1: {id: "task1", description: "Task 1", status: "Pending", sequence: 1, userId: "User 1"},
            task2: {id: "task2", description: "Task 2", status: "Pending", sequence: 2, userId: "User 2"},
            task3: {id: "task3", description: "Task 3", status: "Pending", sequence: 3, userId: "User 3"},
            task4: {id: "task4", description: "Task 4", status: "Pending", sequence: 4, userId: "User 4"},
        }
    
        const movedTasks = taskDef.customReducer.resequence(tasks, {srcId: "task1", destSequence: 3});
    
        expect(movedTasks.task2.sequence).toEqual(0);
        expect(movedTasks.task1.sequence).toEqual(1);
        expect(movedTasks.task3.sequence).toEqual(2);
        expect(movedTasks.task4.sequence).toEqual(3);
    });

    it("should resequence after the destination task", () => {
        const tasks:IEntityState<ITask> = {
            task1: {id: "task1", description: "Task 1", status: "Pending", sequence: 1, userId: "User 1"},
            task2: {id: "task2", description: "Task 2", status: "Pending", sequence: 2, userId: "User 2"},
            task3: {id: "task3", description: "Task 3", status: "Pending", sequence: 3, userId: "User 3"},
            task4: {id: "task4", description: "Task 4", status: "Pending", sequence: 4, userId: "User 4"},
        }
    
        const movedTasks = taskDef.customReducer.resequence(tasks, {srcId: "task1", destSequence: 3, mode: "after"});
    
        expect(movedTasks.task2.sequence).toEqual(0);
        expect(movedTasks.task3.sequence).toEqual(1);
        expect(movedTasks.task1.sequence).toEqual(2);
        expect(movedTasks.task4.sequence).toEqual(3);
    });

    it("should work with existing sequential numbers", () => {
        const tasks:IEntityState<ITask> = {
            task1: {id: "task1", description: "Task 1", status: "Pending", sequence: 0, userId: "User 1"},
            task2: {id: "task2", description: "Task 2", status: "Pending", sequence: 1, userId: "User 2"},
            task3: {id: "task3", description: "Task 3", status: "Pending", sequence: 2, userId: "User 3"},
            task4: {id: "task4", description: "Task 4", status: "Pending", sequence: 3, userId: "User 4"},
        }
    
        const movedTasks = taskDef.customReducer.resequence(tasks, {srcId: "task3", destSequence: 0.5});
    
        expect(movedTasks.task1.sequence).toEqual(0);
        expect(movedTasks.task3.sequence).toEqual(1);
        expect(movedTasks.task2.sequence).toEqual(2);
        expect(movedTasks.task4.sequence).toEqual(3);
    });

    it("should assign unique sequence numbers when resequencing", () => {
        const tasks:IEntityState<ITask> = {
            task1: {id: "task1", description: "Task 1", status: "Pending", sequence: 0, userId: "User 1"},
            task2: {id: "task2", description: "Task 2", status: "Pending", sequence: 0, userId: "User 2"},
            task3: {id: "task3", description: "Task 3", status: "Pending", sequence: 0, userId: "User 3"},
            task4: {id: "task4", description: "Task 4", status: "Pending", sequence: 0, userId: "User 4"},
        }
    
        const movedTasks = taskDef.customReducer.resequence(tasks, {srcId: "task3", destSequence: 1});
        const sequences = Object.keys(movedTasks).map((id: string) => movedTasks[id].sequence);
        const countOf = (s: number) => sequences.filter((a: number) => a === s).length;
        
    
        expect(countOf(0)).toEqual(1);
        expect(countOf(1)).toEqual(1);
        expect(countOf(2)).toEqual(1);
        expect(countOf(3)).toEqual(1);
    });
});
