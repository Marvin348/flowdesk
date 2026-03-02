export type CreateTaskInput = {
    projectId: string;
    title: string;
    collaboratorIds: string[];
    dueDate: string;
    tags?: string[];
    reminderAt?: string;
    description?: string;
}