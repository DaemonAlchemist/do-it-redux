import { entity, getChildren, getParent, getRelated } from 'the-reducer';
import { blockerDef, taskDef, userDef, workflowDef } from './entityDefs';
import { IBlocker, ITask, ITaskCustomAction, IUser, IWorkflow } from './types.d';
import { addTask, removeParam, removeTask, updateDescription, updateParam, updateTaskDependencies, updateTaskDescription, updateTaskId, updateTaskUser } from './workflow';

// User Redux
export const user = {
    ...entity<IUser>(userDef),
    tasks: getChildren<ITask>(taskDef, "userId"),
}

// Task Redux
const t = entity<ITask, ITaskCustomAction>(taskDef);
export const task = {
    ...t,
    blockers: getRelated<IBlocker, ITask>(blockerDef, taskDef, "dependentTaskId", "blockerTaskId"),
    complete: (id:string) => t.update({id, status: "Done"}),
    createId: (userId:string, description:string) => `${userId}:${description}:${Math.random()}`,
    dependentTasks: getRelated<IBlocker, ITask>(blockerDef, taskDef, "blockerTaskId", "dependentTaskId"),
    user: getParent<IUser, ITask>(userDef, taskDef, "userId"),
};

// Blocker Redux
export const blocker = entity<IBlocker>(blockerDef);

// Workflow Redux
const w = entity<IWorkflow>(workflowDef);
export const workflow = {
    ...w,
    util: {updateDescription, updateParam, removeParam, removeTask, addTask, updateTaskId, updateTaskDependencies, updateTaskDescription, updateTaskUser}
}
