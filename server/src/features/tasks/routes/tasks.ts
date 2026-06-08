import express from "express";
import type { Request } from "express";
import type { CreateTaskInput } from "@shared/types/inputs/createTaskInput.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper.js";
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

  const tasks = await TaskModel.find({
    workspaceId,
    projectId: { $in: projectIds },
  }).lean();

  res.json({ data: tasks.map(toTaskDto) });
});

router.post("/", async (req: Request<{}, {}, CreateTaskInput>, res) => {
  try {
    const {
      projectId,
      title,
      collaboratorIds,
      dueDate,
      tags,
      taskPriority,
      reminderAt,
      description,
    } = req.body;

    if (!projectId || !title || !collaboratorIds || !dueDate || !taskPriority) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { userId, workspaceId } = getAuthContext(req);

    const project = await getProjectById({
      projectId,
      userId,
      workspaceId,
    });

    if (!project) {
      return res.status(404).json({ error: "project not found" });
    }

    const newTaskRecord = await TaskModel.create({
      projectId,
      title,
      collaboratorIds,
      dueDate,
      taskStatus: "pending",
      tags,
      taskPriority,
      reminderAt: reminderAt ?? "none",
      description,
      workspaceId,
    });

    await touchProject({ projectId, workspaceId });

    return res.status(201).json({
      data: toTaskDto(newTaskRecord.toObject()),
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create task",
    });
  }
});

export default router;
