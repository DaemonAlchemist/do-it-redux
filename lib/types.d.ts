export type Status = "Pending" | "Done" | "Blocked" | "Blocker" | "Self Blocked";

export interface IUser {
    id: string;
    name: string;
}

export interface ITask {
    id: string;
    userId: string;
    description: string;
    status: Status;
    sequence: number;
    reminder?: number;
}

export interface ITaskCustomAction {
    srcId: string;
    destSequence: number;
}

export interface IBlocker {
    id: string;
    dependentTaskId: string;
    blockerTaskId: string;
}

export interface IWorkflowTask {
    id: string;
    userId: string;
    description: string;
    dependsOn: string[];
}

export interface IWorkflow {
    id: string;
    description: string;
    params: {
        [name: string]: string;
    };
    tasks: IWorkflowTask[];
}
