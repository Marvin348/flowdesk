import { toUserPreviewDto } from "@/features/users/mappers/user.mapper.js";
import type { UserWorkload } from "@shared/types/dto/workload/projectUserWorkload.js";
import { Types } from "mongoose";

export type ProjectWorkloadAggregationUser = {
  _id: Types.ObjectId;
  name: string;
  avatarKey?: string;
  avatarStorageKey?: string;
  jobTitle?: string;
};

export type ProjectWorkloadAggregationItem = {
  _id: Types.ObjectId;
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  doneTasks: number;
  openTasks: number;
  progressPercent: number;
  user: ProjectWorkloadAggregationUser;
};

export type ProjectWorkloadAggregationResult = {
  data: ProjectWorkloadAggregationItem[];
  metaData: {
    totalItems: number;
  }[];
};

export const toProjectUserWorkloadDto = (
  result: ProjectWorkloadAggregationItem,
): UserWorkload => {
  const byStatusCounts = {
    pending: result.pendingTasks,
    in_progress: result.inProgressTasks,
    done: result.doneTasks,
  };

  return {
    totalTasks: result.totalTasks,
    user: toUserPreviewDto(result.user),

    byStatusCounts,

    openCount: result.openTasks,
    progressPercent: result.progressPercent,
  };
};
