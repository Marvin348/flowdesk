import type { Types } from "mongoose";

export type TaskDocument = {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;
  projectId: Types.ObjectId;
  title: string;

  taskStatus: StatusBase;
  collaboratorIds: Types.ObjectId[];
  taskPriority: Priority;
  description?: string;
  tags?: string[];
  reminderAt?: string;
  
  dueDate: Date;
  completedAt?: Date;
};

export const STATUSBASE = ["pending", "in_progress", "done"] as const;
export type StatusBase = (typeof STATUSBASE)[number];

export const PRIORITY = ["low", "medium", "high"] as const;
export type Priority = (typeof PRIORITY)[number];
