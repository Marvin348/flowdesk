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

const router = express.Router();

router.get("/", async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const projects = await getProjects(userId);
  const projectIds = projects.map((project) => project.id);

  const taskRecords = await TaskModel.find({
    projectId: { $in: projectIds },
  }).lean();

  const taskIds = taskRecords.map((task) => task._id.toString());
  
  const comments = await CommentModel.find({
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

    const task = await TaskModel.findById(taskId).lean();

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const project = await getProjectById({
      projectId: task.projectId,
      userId,
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (parentCommentId) {
      const parentComment = await CommentModel.findOne({
        _id: parentCommentId,
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
      taskId,
      userId,
      message,
      parentCommentId,
    });

    await touchProject(task.projectId);

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
