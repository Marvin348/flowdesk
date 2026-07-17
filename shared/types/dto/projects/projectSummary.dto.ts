import type { Priority } from "../../Priority.js";
import type { StatusBase } from "../../StatusBase.js";
import type { Progress } from "../common/progress.dto.js";
import type { UserAvatarDto } from "../common/userPreview.dto.js";

export type ProjectSummariesDto = {
  id: string;
  title: string;
  priority: Priority;
  projectStatus: StatusBase;
  dueDate: string;
  createdAt: string;

  invitedUserIds: string[];
  invitedUsers: UserAvatarDto[];

  progress: Progress;

  stats: {
    commentCount: number;
    attachmentCount: number;
    userCount: number;
  };
};

export type ProjectSummariesResponseDto = {
  items: ProjectSummariesDto[];
  pagination: {
    currentPage: number;
    totalPages: number;
  };
};
