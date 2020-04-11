"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var entityDefs_1 = require("./entityDefs");
var workflow_1 = require("./workflow");
var origWorkflow = {
    description: "Test Description",
    id: "test",
    params: {
        test: "Test Param",
        another: "Another Param",
    },
    tasks: [
        { id: "test", description: "Test task", userId: "Andy", dependsOn: [] },
        { id: "test2", description: "Test2 task", userId: "Andrea", dependsOn: ["test"] },
        { id: "test3", description: "Test3 task", userId: "Gemma", dependsOn: ["tes2"] },
    ],
};
describe("workflow utility functions", function () {
    describe("updateDescription", function () {
        it("should update the description", function () {
            var newWorkflow = workflow_1.updateDescription(origWorkflow, "New description");
            expect(newWorkflow.id).toEqual("test");
            expect(newWorkflow.description).toEqual("New description");
        });
    });
    describe("updateParam", function () {
        it("should update an existing param name", function () {
            var newWorkflow = workflow_1.updateParam(origWorkflow, "test", "New Test Param");
            expect(newWorkflow.params.test).toEqual("New Test Param");
        });
        it("should add new params", function () {
            var newWorkflow = workflow_1.updateParam(origWorkflow, "test2", "New Test Param");
            expect(newWorkflow.params.test).toEqual("Test Param");
            expect(newWorkflow.params.test2).toEqual("New Test Param");
        });
    });
    describe("remove param", function () {
        it("should remove a parameter", function () {
            var newWorkflow = workflow_1.removeParam(origWorkflow, "another");
            expect(newWorkflow.params.test).toEqual("Test Param");
            expect(newWorkflow.params.another).toBeUndefined();
        });
    });
    describe("addTask", function () {
        it("should add a task", function () {
            var newWorkflow = workflow_1.addTask(origWorkflow, { id: "newTask", description: "New Task", userId: "Gemma", dependsOn: ["test", "test2"] });
            expect(newWorkflow.tasks.length).toEqual(4);
            expect(newWorkflow.tasks[3].id).toEqual("newTask");
            expect(newWorkflow.tasks[3].dependsOn).toEqual(["test", "test2"]);
        });
        it("should remove dependencies on non-existent tasks", function () {
            var newWorkflow = workflow_1.addTask(origWorkflow, { id: "newTask", description: "New Task", userId: "Gemma", dependsOn: ["test", "test4"] });
            expect(newWorkflow.tasks[3].id).toEqual("newTask");
            expect(newWorkflow.tasks[3].dependsOn).toEqual(["test"]);
        });
    });
    describe("removeTask", function () {
        it("should remove a task", function () {
            var newWorkflow = workflow_1.removeTask(origWorkflow, "test2");
            expect(newWorkflow.tasks.length).toEqual(2);
            expect(newWorkflow.tasks[0].id).toEqual("test");
        });
        it("should remove dependencies that point to the removed task", function () {
            var newWorkflow = workflow_1.removeTask(origWorkflow, "test");
            expect(newWorkflow.tasks[0].id).toEqual("test2");
            expect(newWorkflow.tasks[0].dependsOn).toEqual([]);
        });
    });
    describe("updateTaskId", function () {
        it("should update a task's id and dependencies that point to it", function () {
            var newWorkflow = workflow_1.updateTaskId(origWorkflow, "test", "newTest");
            expect(newWorkflow.tasks[0].id).toEqual("newTest");
            expect(newWorkflow.tasks[1].id).toEqual("test2");
            expect(newWorkflow.tasks[1].dependsOn).toEqual(["newTest"]);
        });
    });
    describe("updateTaskDescription", function () {
        it("should update a task's description", function () {
            var newWorkflow = workflow_1.updateTaskDescription(origWorkflow, "test", "New description");
            expect(newWorkflow.tasks[0].description).toEqual("New description");
            expect(newWorkflow.tasks[1].description).toEqual("Test2 task");
        });
    });
    describe("updateTaskUser", function () {
        it("should update a task's user", function () {
            var newWorkflow = workflow_1.updateTaskUser(origWorkflow, "test", "Seta");
            expect(newWorkflow.tasks[0].userId).toEqual("Seta");
            expect(newWorkflow.tasks[1].userId).toEqual("Andrea");
        });
    });
    describe("updateTaskDependencies", function () {
        it("should update a task's dependencies", function () {
            var newWorkflow = workflow_1.updateTaskDependencies(origWorkflow, "test2", ["test3"]);
            expect(newWorkflow.tasks[0].dependsOn).toEqual([]);
            expect(newWorkflow.tasks[1].dependsOn).toEqual(["test3"]);
        });
        it("should remove dependencies on non-existent tasks", function () {
            var newWorkflow = workflow_1.updateTaskDependencies(origWorkflow, "test2", ["test3", "test4"]);
            expect(newWorkflow.tasks[0].dependsOn).toEqual([]);
            expect(newWorkflow.tasks[1].dependsOn).toEqual(["test3"]);
        });
    });
});
describe("task resequencing", function () {
    it("should resequence tasks", function () {
        var tasks = {
            task1: { id: "task1", description: "Task 1", status: "Pending", sequence: -5, userId: "User 1" },
            task2: { id: "task2", description: "Task 2", status: "Pending", sequence: 10, userId: "User 2" },
            task3: { id: "task3", description: "Task 3", status: "Pending", sequence: 20, userId: "User 3" },
            task4: { id: "task4", description: "Task 4", status: "Pending", sequence: 40, userId: "User 4" },
        };
        var movedTasks = entityDefs_1.taskDef.customReducer.resequence(tasks, { srcId: "task3", destSequence: 1 });
        expect(movedTasks.task1.sequence).toEqual(0);
        expect(movedTasks.task3.sequence).toEqual(1);
        expect(movedTasks.task2.sequence).toEqual(2);
        expect(movedTasks.task4.sequence).toEqual(3);
    });
    it("should work with existing sequential numbers", function () {
        var tasks = {
            task1: { id: "task1", description: "Task 1", status: "Pending", sequence: 0, userId: "User 1" },
            task2: { id: "task2", description: "Task 2", status: "Pending", sequence: 1, userId: "User 2" },
            task3: { id: "task3", description: "Task 3", status: "Pending", sequence: 2, userId: "User 3" },
            task4: { id: "task4", description: "Task 4", status: "Pending", sequence: 3, userId: "User 4" },
        };
        var movedTasks = entityDefs_1.taskDef.customReducer.resequence(tasks, { srcId: "task3", destSequence: 0.5 });
        expect(movedTasks.task1.sequence).toEqual(0);
        expect(movedTasks.task3.sequence).toEqual(1);
        expect(movedTasks.task2.sequence).toEqual(2);
        expect(movedTasks.task4.sequence).toEqual(3);
    });
    it("should assign unique sequence numbers when resequencing", function () {
        var tasks = {
            task1: { id: "task1", description: "Task 1", status: "Pending", sequence: 0, userId: "User 1" },
            task2: { id: "task2", description: "Task 2", status: "Pending", sequence: 0, userId: "User 2" },
            task3: { id: "task3", description: "Task 3", status: "Pending", sequence: 0, userId: "User 3" },
            task4: { id: "task4", description: "Task 4", status: "Pending", sequence: 0, userId: "User 4" },
        };
        var movedTasks = entityDefs_1.taskDef.customReducer.resequence(tasks, { srcId: "task3", destSequence: 1 });
        var sequences = Object.keys(movedTasks).map(function (id) { return movedTasks[id].sequence; });
        var countOf = function (s) { return sequences.filter(function (a) { return a === s; }).length; };
        expect(countOf(0)).toEqual(1);
        expect(countOf(1)).toEqual(1);
        expect(countOf(2)).toEqual(1);
        expect(countOf(3)).toEqual(1);
    });
});
