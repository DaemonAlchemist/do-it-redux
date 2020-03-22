import { IEntityState } from 'the-reducer';
import { ITask, Status } from './redux.d';

export const userDef = {
    default: {id: "0", name: ""},
    entity: "user",
    module: "doIt",
};

export const taskDef = {
    customReducer: {
        resequence: (state:IEntityState<ITask>, data:any):IEntityState<ITask> => 
            Object.keys(state)
                // Get an array of all of the task with their new sequence number
                .map((id:string):ITask => {
                    let newSequence = state[id].sequence;
                    if(newSequence > state[data.srcId].sequence) {newSequence--;}
                    if(newSequence >= data.destSequence) {newSequence++;}
                    return {
                        ...state[id],
                        sequence: data.srcId === id ? data.destSequence : newSequence
                    }
                })
                // Sort the tasks by sequence
                .sort((a:ITask, b:ITask):number => a.sequence - b.sequence)
                // Assign new consecutive sequence numbers
                .map((task:ITask, index:number):ITask => ({...task, sequence: index}))
                // Convert back into state object
                .reduce((curState:IEntityState<ITask>, task:ITask) => ({...curState, [task.id]: task}), {})
    },
    default: {id: "0", userId: "0", description: "", sequence: 9999, status: "Pending" as Status},
    entity: "task",
    module: "doIt",
};

export const blockerDef = {
    default: {id: "", dependentTaskId: "", blockerTaskId: ""},
    entity: "blockers",
    module: "doIt",
};
