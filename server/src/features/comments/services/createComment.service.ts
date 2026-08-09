import { TaskModel } from "@/features/tasks/models/task.model";
import { getProjectById } from "@/features/projects/services/project.service";
import { AppError } from "@/utils/AppError";
import { CommentModel } from "@/features/comments/models/comment.model";
import { touchProject } from "@/features/projects/services/project.service";
import { toCommentDto } from "@/features/comments/mappers/comment.mapper";
import { createActivity } from "@/features/activity/services/createActivity.service";
import mongoose, { Types } from "mongoose";
import type { CreateCommentBody } from "@/features/comments/validation/comments.validator";
import { notificationQueue } from "@/queues/notificationQueue";

type CreateCommentInput = {
  workspaceId: Types.ObjectId;
  userId: string;
  input: CreateCommentBody;
};

export const createComment = async ({
  workspaceId,
  userId,
  input,
}: CreateCommentInput) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

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

  let parentComment = null;

  if (parentCommentId) {
    parentComment = await CommentModel.findOne({
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

  // refactor later
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

  if (parentComment) {
    await notificationQueue.add("comment-reply", {
      workspaceId: workspaceId.toString(),
      actorId: userObjectId.toString(),
      recipientId: parentComment.userId.toString(),
      commentId: newComment._id.toString(),
      projectId: task.projectId.toString(),
    });
  }

  return toCommentDto(newComment);
};
