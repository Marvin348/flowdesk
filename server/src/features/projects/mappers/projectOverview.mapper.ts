import type { ProjectOverviewDto } from "@shared/types/dto/projects/projectOverview.dto.js";
import { toUserPreviewDto } from "@/features/users/mappers/user.mapper.js";
import { isDefined } from "@/shared/utils/isDefined.js";
import { Types } from "mongoose";
import { StatusBase } from "@shared/types/StatusBase.js";
import { calcPercent } from "@shared/utils/calcPercent.js";
import { toIsoString } from "@/utils/toIsoString.js";
import { UserWorkload } from "@shared/types/dto/workload/projectUserWorkload.js";

export type ProjectOverviewAggregationResult = {
  _id: Types.ObjectId;

  totalTasks: number;
  doneTasks: number;

  openTasks: {
    _id: Types.ObjectId;
    title: string;
    dueDate: Date;
    taskStatus: StatusBase;
    description?: string;
    collaboratorIds: Types.ObjectId[];
  }[];

  comments: {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    message: string;
    createdAt: Date;
  }[];

  invitedUsers: {
    _id: Types.ObjectId;
    name: string;
    jobTitle?: string;
    avatarKey?: string;
    avatarStorageKey?: string;
  }[];
};

export const toProjectOverviewDto = (
  overview: ProjectOverviewAggregationResult,
  workload: UserWorkload[],
): ProjectOverviewDto => {
  const usersById = new Map(
    overview.invitedUsers.map((user) => [user._id.toString(), user]),
  );

  const collaborators = overview.invitedUsers
    .slice(0, 6)
    .map((user) => toUserPreviewDto(user));

  const openTasks = overview.openTasks.map((task) => {
    const collaborators = task.collaboratorIds
      .map((id) => usersById.get(id.toString()))
      .filter(isDefined)
      .map((user) => toUserPreviewDto(user));

    return {
      id: task._id.toString(),
      title: task.title,
      dueDate: toIsoString(task.dueDate),
      taskStatus: task.taskStatus,
      description: task.description,
      collaborators,
    };
  });

  const recentComments = overview.comments.map((comment) => {
    const user = usersById.get(comment.userId.toString());

    return {
      id: comment._id.toString(),
      message: comment.message,
      createdAt: toIsoString(comment.createdAt),
      user: user ? toUserPreviewDto(user) : null,
    };
  });

  const progressPercent = calcPercent(overview.doneTasks, overview.totalTasks);

  const progress = {
    total: overview.totalTasks,
    completed: overview.doneTasks,
    progressPercent,
  };

  return {
    collaborators,
    openTasks,
    recentComments,
    progress,
    workload,
  };
};
