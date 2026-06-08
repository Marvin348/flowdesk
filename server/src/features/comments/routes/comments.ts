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

const router = express.Router();

router.get("/", async (req, res) => {
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
});

// new comment
router.post("/", async (req: Request<{}, {}, CreateCommentInput>, res) => {
  try {
    const { taskId, message, parentCommentId } = req.body;

    if (!taskId || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { userId, workspaceId } = getAuthContext(req);

    const task = await TaskModel.findOne({
      _id: taskId,
      workspaceId,
    }).lean();

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const project = await getProjectById({
      projectId: task.projectId,
      userId,
      workspaceId,
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (parentCommentId) {
      const parentComment = await CommentModel.findOne({
        _id: parentCommentId,
        workspaceId,
        taskId,
      }).lean();

      if (!parentComment) {
        return res.status(404).json({ error: "Parent comment not found" });
      }

      if (parentComment.taskId !== taskId) {
        return res.status(400).json({
          error: "Parent comment does not belong to this task",
        });
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
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create comment",
    });
  }
});

export default router;
