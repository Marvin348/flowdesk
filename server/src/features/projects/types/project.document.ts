import type { Types } from "mongoose";


export type ProjectDocument = {
  _id: Types.ObjectId;

  title: string;
  description?: string;

  priority: Priority;
  projectStatus: StatusBase;

  invitedUserIds: string[];
  
  dueDate: Date;
  createdAt: Date;
  updatedAt?: Date;
};

export const STATUSBASE = ["pending", "in_progress", "done"] as const;
export type StatusBase = (typeof STATUSBASE)[number];

export const PRIORITY = ["low", "medium", "high"] as const;
export type Priority = (typeof PRIORITY)[number];