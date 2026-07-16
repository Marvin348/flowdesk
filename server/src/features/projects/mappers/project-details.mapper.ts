import { Types } from "mongoose";
import { Priority } from "@shared/types/priority.js";
import { StatusBase } from "@shared/types/StatusBase.js";
import type { ProjectDetailsShellDto } from "@shared/types/dto/projects/projectDetailsShell.dto.js";
import { toIsoString } from "@/utils/toIsoString.js";
import { toUserAvatarDto } from "@/features/users/mappers/user.mapper.js";
import { calcPercent } from "@shared/utils/calcPercent.js";

export type ProjectDetailsAggregationResult = {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;

  title: string;
  description?: string;
  ownerId: Types.ObjectId;

  priority: Priority;
  projectStatus: StatusBase;

  dueDate: Date;
  updatedAt: Date;
  createdAt: Date;

  invitedUserIds: Types.ObjectId[];
  invitedUsers: {
    _id: Types.ObjectId;
    avatarKey?: string;
    avatarStorageKey?: string;
  }[];

  totalTasks: number;
  doneTasks: number;
};

export const toProjectDetailsDto = (
  project: ProjectDetailsAggregationResult,
): ProjectDetailsShellDto => ({
  id: project._id.toString(),
  title: project.title,
  priority: project.priority,
  description: project.description,
  projectStatus: project.projectStatus,
  dueDate: toIsoString(project.dueDate),
  createdAt: toIsoString(project.createdAt),
  updatedAt: toIsoString(project.updatedAt),
  invitedUserIds: project.invitedUserIds.map((id) => id.toString()),

  invitedUsers: project.invitedUsers.map((user) => toUserAvatarDto(user)),

  progressPercent: calcPercent(project.doneTasks, project.totalTasks),
});
