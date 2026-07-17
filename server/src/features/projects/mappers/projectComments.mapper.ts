import { bulidPublicFileUrl } from "@/utils/bulidPublicFileUrl";
import { toIsoString } from "@/utils/toIsoString";
import type {
  ProjectCommentDto,
  ProjectCommentsDto,
} from "@shared/types/dto/projects/projectComments.dto";
import { Types } from "mongoose";

export type ProjectCommentsAggregationTask = {
  _id: Types.ObjectId;
  title: string;
};

export type ProjectCommentsAggregationComment = {
  _id: Types.ObjectId;
  taskId: Types.ObjectId;
  userId: Types.ObjectId;
  message: string;
  createdAt: Date;
  parentCommentId?: Types.ObjectId;
};

export type ProjectCommentsAggregationUser = {
  _id: Types.ObjectId;
  name: string;
  avatarKey?: string;
  avatarStorageKey?: string;
};

export type ProjectCommentsAggregationResult = {
  tasks: ProjectCommentsAggregationTask[];
  comments: ProjectCommentsAggregationComment[];
  users: ProjectCommentsAggregationUser[];
  totalItems: number;
};

export const toProjectCommentsDto = (
  result: ProjectCommentsAggregationResult,
): ProjectCommentsDto => {
  const usersById = new Map(result.users.map((u) => [u._id.toString(), u]));
  const tasksById = new Map(result.tasks.map((t) => [t._id.toString(), t]));

  const comments: ProjectCommentDto[] = result.comments.flatMap((c) => {
    const task = tasksById.get(c.taskId.toString());

    if (!task) return [];

    const user = usersById.get(c.userId.toString());

    return {
      id: c._id.toString(),
      message: c.message,
      createdAt: toIsoString(c.createdAt),
      parentCommentId: c.parentCommentId?.toString(),

      task: { id: task._id.toString(), title: task.title },
      user: user
        ? {
            id: user._id.toString(),
            name: user.name,
            avatarKey: user.avatarKey,
            avatarUrl: bulidPublicFileUrl(user.avatarStorageKey),
          }
        : null,
    };
  });

  const taskOptions = result.tasks.map((t) => ({
    taskId: t._id.toString(),
    taskTitle: t.title,
  }));

  return {
    comments,
    taskOptions,
  };
};
