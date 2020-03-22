import { entity, getChildren, getParent, getRelated } from 'the-reducer';
import { blockerDef, taskDef, userDef } from './entityDefs';
import { IBlocker, ITask, IUser, ITaskCustomAction } from './redux.d';

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
