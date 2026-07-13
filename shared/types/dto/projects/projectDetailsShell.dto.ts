import type { Priority } from "../../priority.js";
import type { StatusBase } from "../../StatusBase.js";
import type { UserAvatarDto } from "../common/userPreview.dto.js";

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
