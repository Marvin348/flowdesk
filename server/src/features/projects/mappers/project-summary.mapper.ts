import type { ProjectSummariesDto } from "@shared/types/dto/projects/projectSummary.dto";
import { calcPercent } from "@/shared/utils/calcPercent";
import { Types } from "mongoose";
import type { Priority } from "@shared/types/Priority";
import type { StatusBase } from "@shared/types/StatusBase";
import { toIsoString } from "@/utils/toIsoString";
import { bulidPublicFileUrl } from "@/utils/bulidPublicFileUrl";

type ProjectSummaryAggregationResult = {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;

  title: string;
  description?: string;
  ownerId: Types.ObjectId;

  priority: Priority;
  projectStatus: StatusBase;

  dueDate: Date;
  invitedUserIds: Types.ObjectId[];
  createdAt: Date;

  invitedUsers: {
    _id: Types.ObjectId;
    name: string;
    avatarKey?: string;
    avatarStorageKey?: string;
  }[];

  totalTasks: number;
  doneTasks: number;

  commentCount: number;
  attachmentCount: number;
  userCount: number;
};

export const toProjectSummaryDto = (
  project: ProjectSummaryAggregationResult,
): ProjectSummariesDto => ({
  id: project._id.toString(),
  title: project.title,
  priority: project.priority,
  projectStatus: project.projectStatus,
  dueDate: toIsoString(project.dueDate),
  createdAt: toIsoString(project.createdAt),
  invitedUserIds: project.invitedUserIds.map((id) => id.toString()),

  invitedUsers: project.invitedUsers.map((user) => {
    return {
      id: user._id.toString(),
      name: user.name,
      avatarKey: user.avatarKey,
      avatarUrl: bulidPublicFileUrl(user.avatarStorageKey),
    };
  }),

  progress: {
    total: project.totalTasks,
    progressPercent: calcPercent(project.doneTasks, project.totalTasks),
    completed: project.doneTasks,
  },

  stats: {
    commentCount: project.commentCount,
    attachmentCount: project.attachmentCount,
    userCount: project.userCount,
  },
});
