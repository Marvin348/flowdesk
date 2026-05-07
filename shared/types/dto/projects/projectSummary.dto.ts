import type { Priority } from "../../priority";
import type { StatusBase } from "../../StatusBase";

export type ProjectSummariesDto = {
  id: string;
  title: string;
  priority: Priority;
  projectStatus: StatusBase;
  dueDate: string;
  teamUserIds: string[];
  createdAt: string;

  stats: {
    taskCount: number;
    commentCount: number;
    attachmentCount: number;
    completedTaskCount: number;
    userCount: number;
  };
};

export type ProjectSummariesResponseDto = {
  items: ProjectSummariesDto[];
  currentPage: number;
  totalPages: number;
};