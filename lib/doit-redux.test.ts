import { AssertionError } from "assert";
import { IEntityState } from "the-reducer";
import { ITask } from "./types";
import { taskDef } from "./entityDefs";

describe("task resequencing", () => {
    it("should resequence tasks", () => {
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
