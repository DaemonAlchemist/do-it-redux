import { IEntityState } from 'the-reducer';
import { ITask, Status } from './redux.d';
export declare const userDef: {
    default: {
        id: string;
        name: string;
    };
    entity: string;
    module: string;
};
export declare const taskDef: {
    customReducer: {
        resequence: (state: IEntityState<ITask>, data: any) => IEntityState<ITask>;
    };
    default: {
        id: string;
        userId: string;
        description: string;
        sequence: number;
        status: Status;
    };
    entity: string;
    module: string;
};
export declare const blockerDef: {
    default: {
        id: string;
        dependentTaskId: string;
        blockerTaskId: string;
    };
    entity: string;
    module: string;
};
