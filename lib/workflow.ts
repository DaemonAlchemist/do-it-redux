import { IWorkflow, IWorkflowTask } from "./types";
import {omit, prop} from 'ts-functional';

export const updateDescription = (workflow:IWorkflow, description:string):IWorkflow => ({
    ...workflow,
    description,
});

export const updateParam = (workflow:IWorkflow, name:string, description:string):IWorkflow => ({
    ...workflow,
    params: {
        ...workflow.params,
        [name]: description,
    }
});

export const removeParam = (workflow:IWorkflow, name:string):IWorkflow => ({
    ...workflow,
    params: omit<{[name:string]:string}, any>(name)(workflow.params),
});

export const addTask = (workflow:IWorkflow, task:IWorkflowTask):IWorkflow => ({
    ...workflow,
    tasks: [
        ...workflow.tasks,
        {
            ...task,
            dependsOn: task.dependsOn.filter((otherTaskId:string) => workflow.tasks.map(prop("id")).includes(otherTaskId))
        }
    ]
});

export const removeTask = (workflow:IWorkflow, taskId:string):IWorkflow => ({
    ...workflow,
    tasks: workflow.tasks
        .filter((task) => task.id !== taskId)
        .map((task) => ({
            ...task,
            dependsOn: task.dependsOn.filter((tid:string) => tid !== taskId)
        }))
});

export const updateTaskId = (workflow:IWorkflow, oldId:string, newId:string):IWorkflow => ({
    ...workflow,
    tasks: workflow.tasks
        .map((task:IWorkflowTask) => ({
            ...task,
            id: task.id === oldId ? newId : task.id,
            dependsOn: task.dependsOn.map((id:string) => id === oldId ? newId : id)
        }))
});

export const updateTaskDescription = (workflow:IWorkflow, id:string, description:string):IWorkflow => ({
    ...workflow,
    tasks: workflow.tasks.map((task:IWorkflowTask) => ({
        ...task,
        description: task.id === id ? description : task.description, 
    }))
});

export const updateTaskUser = (workflow:IWorkflow, id:string, userId:string):IWorkflow => ({
    ...workflow,
    tasks: workflow.tasks.map((task:IWorkflowTask) => ({
        ...task,
        userId: task.id === id ? userId : task.userId, 
    }))
});

export const updateTaskDependencies = (workflow:IWorkflow, id:string, dependsOn:string[]):IWorkflow => ({
    ...workflow,
    tasks: workflow.tasks.map((task:IWorkflowTask) => ({
        ...task,
        dependsOn: task.id === id
            ? dependsOn.filter((otherTaskId:string) => workflow.tasks.map(prop("id")).includes(otherTaskId))
            : task.dependsOn, 
    }))    
});

