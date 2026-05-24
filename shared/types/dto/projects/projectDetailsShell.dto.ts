import type { Priority } from "../../priority";
import type { StatusBase } from "../../StatusBase";
import type { UserAvatarDto } from "../common/userPreview.dto";

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

    invitedUsers: UserAvatarDto[]
    progressPercent: number;
};
