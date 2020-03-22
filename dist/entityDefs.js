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
exports.userDef = {
    default: { id: "0", name: "" },
    entity: "user",
    module: "doIt",
};
exports.taskDef = {
    customReducer: {
        resequence: function (state, data) {
            return Object.keys(state)
                // Get an array of all of the task with their new sequence number
                .map(function (id) {
                var newSequence = state[id].sequence;
                if (newSequence > state[data.srcId].sequence) {
                    newSequence--;
                }
                if (newSequence >= data.destSequence) {
                    newSequence++;
                }
                return __assign(__assign({}, state[id]), { sequence: data.srcId === id ? data.destSequence : newSequence });
            })
                // Sort the tasks by sequence
                .sort(function (a, b) { return a.sequence - b.sequence; })
                // Assign new consecutive sequence numbers
                .map(function (task, index) { return (__assign(__assign({}, task), { sequence: index })); })
                // Convert back into state object
                .reduce(function (curState, task) {
                var _a;
                return (__assign(__assign({}, curState), (_a = {}, _a[task.id] = task, _a)));
            }, {});
        }
    },
    default: { id: "0", userId: "0", description: "", sequence: 9999, status: "Pending" },
    entity: "task",
    module: "doIt",
};
exports.blockerDef = {
    default: { id: "", dependentTaskId: "", blockerTaskId: "" },
    entity: "blockers",
    module: "doIt",
};
