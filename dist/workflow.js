"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts_functional_1 = require("ts-functional");
exports.updateDescription = function (workflow, description) { return (__assign(__assign({}, workflow), { description: description })); };
exports.updateParam = function (workflow, name, description) {
    var _a;
    return (__assign(__assign({}, workflow), { params: __assign(__assign({}, workflow.params), (_a = {}, _a[name] = description, _a)) }));
};
exports.removeParam = function (workflow, name) { return (__assign(__assign({}, workflow), { params: ts_functional_1.omit(name)(workflow.params) })); };
exports.addTask = function (workflow, task) { return (__assign(__assign({}, workflow), { tasks: __spreadArrays(workflow.tasks, [
        __assign(__assign({}, task), { dependsOn: task.dependsOn.filter(function (otherTaskId) { return workflow.tasks.map(ts_functional_1.prop("id")).includes(otherTaskId); }) })
    ]) })); };
exports.removeTask = function (workflow, taskId) { return (__assign(__assign({}, workflow), { tasks: workflow.tasks
        .filter(function (task) { return task.id !== taskId; })
        .map(function (task) { return (__assign(__assign({}, task), { dependsOn: task.dependsOn.filter(function (tid) { return tid !== taskId; }) })); }) })); };
exports.updateTaskId = function (workflow, oldId, newId) { return (__assign(__assign({}, workflow), { tasks: workflow.tasks
        .map(function (task) { return (__assign(__assign({}, task), { id: task.id === oldId ? newId : task.id, dependsOn: task.dependsOn.map(function (id) { return id === oldId ? newId : id; }) })); }) })); };
exports.updateTaskDescription = function (workflow, id, description) { return (__assign(__assign({}, workflow), { tasks: workflow.tasks.map(function (task) { return (__assign(__assign({}, task), { description: task.id === id ? description : task.description })); }) })); };
exports.updateTaskUser = function (workflow, id, userId) { return (__assign(__assign({}, workflow), { tasks: workflow.tasks.map(function (task) { return (__assign(__assign({}, task), { userId: task.id === id ? userId : task.userId })); }) })); };
exports.updateTaskDependencies = function (workflow, id, dependsOn) { return (__assign(__assign({}, workflow), { tasks: workflow.tasks.map(function (task) { return (__assign(__assign({}, task), { dependsOn: task.id === id
            ? dependsOn.filter(function (otherTaskId) { return workflow.tasks.map(ts_functional_1.prop("id")).includes(otherTaskId); })
            : task.dependsOn })); }) })); };
