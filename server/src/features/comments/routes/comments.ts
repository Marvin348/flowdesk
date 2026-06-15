import express from "express";
import type { Request } from "express";
import type { CreateCommentInput } from "@shared/types/inputs/createCommentInput.js";
import { CommentModel } from "@/features/comments/models/comment.model.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { toCommentDto } from "@/features/comments/mappers/comment.mapper.js";
import {
  getProjectById,
  getProjects,
  touchProject,
} from "@/features/projects/services/project.service.js";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { AppError } from "@/utils/AppError.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { userId, workspaceId } = getAuthContext(req);

    const projects = await getProjects({ userId, workspaceId });
    const projectIds = projects.map((project) => project.id);

    const taskRecords = await TaskModel.find({
      workspaceId,
      projectId: { $in: projectIds },
    }).lean();

    const taskIds = taskRecords.map((task) => task._id.toString());

    const comments = await CommentModel.find({
      workspaceId,
      taskId: { $in: taskIds },
    }).lean();

    res.json({ data: comments });
  }),
);

// new comment
router.post(
  "/",
  asyncHandler(async (req: Request<{}, {}, CreateCommentInput>, res) => {
    const { taskId, message, parentCommentId } = req.body;

    if (!taskId || !message) {
      throw new AppError("Missing required fields", 400);
    }

    const { userId, workspaceId } = getAuthContext(req);

    const task = await TaskModel.findOne({
      _id: taskId,
      workspaceId,
    }).lean();

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    const project = await getProjectById({
      projectId: task.projectId,
      userId,
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

      if (parentComment.taskId !== taskId) {
        throw new AppError("Parent comment does not belong to this task", 400);
      }
    }

    const newCommentRecord = await CommentModel.create({
      workspaceId,
      taskId,
      userId,
      message,
      parentCommentId,
    });

    await touchProject({ projectId: task.projectId, workspaceId });

    return res.status(201).json({
      data: toCommentDto(newCommentRecord.toObject()),
    });
  }),
);

export default router;
