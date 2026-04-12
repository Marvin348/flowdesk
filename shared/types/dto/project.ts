import type { Priority } from "../priority.js";
import type { StatusBase } from "../statusBase.js";
import type { Project } from "../project.js";
import type { Task } from "../task.js";
import type { Attachment } from "../attachment.js";
import type { User } from "../user.js";

export type ProjectSummaryDto = {
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

export type ProjectDetailsDto = {
  project: Project;
  tasks: Task[];
  users: User[];
  comments: Comment[];
  attachments: Attachment[];
};
