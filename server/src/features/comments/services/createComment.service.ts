import { TaskModel } from "@/features/tasks/models/task.model.js";
import { getProjectById } from "@/features/projects/services/project.service.js";
import { AppError } from "@/utils/AppError.js";
import { CommentModel } from "@/features/comments/models/comment.model.js";
import type { CreateCommentInput } from "@shared/types/inputs/createCommentInput.js";
import { touchProject } from "@/features/projects/services/project.service.js";
import { toCommentDto } from "@/features/comments/mappers/comment.mapper.js";
import { createActivity } from "@/features/activity/services/createActivity.service.js";
import { Types } from "mongoose";

type CreateCommentParams = {
  workspaceId: Types.ObjectId;
  userId: string;
  input: Pick<CreateCommentInput, "taskId" | "message" | "parentCommentId">;
};

export const createComment = async ({
  workspaceId,
  userId,
  input,
}: CreateCommentParams) => {
  const { taskId, message, parentCommentId } = input;

  const task = await TaskModel.findOne({
    _id: taskId,
    workspaceId,
  }).lean();

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const project = await getProjectById({
    projectId: task.projectId,
    workspaceId,
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (parentCommentId) {
    const parentComment = await CommentModel.findOne({
      _id: parentCommentId,
      workspaceId,
      taskId,
    }).lean();

    if (!parentComment) {
      throw new AppError("Parent comment not found", 404);
    }

    if (parentComment.taskId.toString() !== taskId) {
      throw new AppError("Parent comment does not belong to this task", 400);
    }
  }

  const newComment = await CommentModel.create({
    workspaceId,
    taskId,
    userId,
    message,
    parentCommentId,
  });

  await touchProject({ projectId: task.projectId.toString(), workspaceId });

  await createActivity({
    workspaceId,
    actorId: userId,
    type: "comment.created",
    entityType: "comment",
    entityId: newComment._id.toString(),
    metadata: {
      taskId,
      taskTitle: task.title,
      projectId: project.id,
      commentMessage: newComment.message,
    },
  });

  return toCommentDto(newComment);
};
