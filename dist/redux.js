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
Object.defineProperty(exports, "__esModule", { value: true });
var the_reducer_1 = require("the-reducer");
var entityDefs_1 = require("./entityDefs");
var workflow_1 = require("./workflow");
// User Redux
exports.user = __assign(__assign({}, the_reducer_1.entity(entityDefs_1.userDef)), { tasks: the_reducer_1.getChildren(entityDefs_1.taskDef, "userId") });
// Task Redux
var t = the_reducer_1.entity(entityDefs_1.taskDef);
exports.task = __assign(__assign({}, t), { blockers: the_reducer_1.getRelated(entityDefs_1.blockerDef, entityDefs_1.taskDef, "dependentTaskId", "blockerTaskId"), complete: function (id) { return t.update({ id: id, status: "Done" }); }, createId: function (userId, description) { return userId + ":" + description + ":" + Math.random(); }, dependentTasks: the_reducer_1.getRelated(entityDefs_1.blockerDef, entityDefs_1.taskDef, "blockerTaskId", "dependentTaskId"), user: the_reducer_1.getParent(entityDefs_1.userDef, entityDefs_1.taskDef, "userId") });
// Blocker Redux
exports.blocker = the_reducer_1.entity(entityDefs_1.blockerDef);
// Workflow Redux
var w = the_reducer_1.entity(entityDefs_1.workflowDef);
exports.workflow = __assign(__assign({}, w), { util: { updateDescription: workflow_1.updateDescription, updateParam: workflow_1.updateParam, removeParam: workflow_1.removeParam, removeTask: workflow_1.removeTask, addTask: workflow_1.addTask, updateTaskId: workflow_1.updateTaskId, updateTaskDependencies: workflow_1.updateTaskDependencies, updateTaskDescription: workflow_1.updateTaskDescription, updateTaskUser: workflow_1.updateTaskUser } });
