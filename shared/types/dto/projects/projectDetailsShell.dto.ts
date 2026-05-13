import type { Priority } from "../../priority";
import type { StatusBase } from "../../StatusBase";

export type ProjectDetailsShellDto = {
    id: string;
    title: string;
    description?: string;
    priority: Priority;
    projectStatus: StatusBase;
    dueDate: string;
    createdAt: string;
    invitedUserIds: string[];
    updatedAt?: string;

    progressPercent: number;
};
