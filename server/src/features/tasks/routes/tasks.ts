import express from "express";
import type { Request, Response } from "express";
import type { CreateTaskInput } from "@shared/types/inputs/createTaskInput.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const tasks = await TaskModel.find().lean();
  res.json({ data: tasks });
});

// post in details
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

    const project = await ProjectModel.findOne({ id: projectId }).lean();

    if (!project) {
      return res.status(404).json({ error: "project not found" });
    }

    const newTaskRecord = await TaskModel.create({
      id: crypto.randomUUID(),
      projectId,
      title,
      collaboratorIds,
      dueDate,
      taskStatus: "pending",
      tags,
      taskPriority,
      reminderAt: reminderAt ?? "none",
      description,
    });

    await ProjectModel.findOneAndUpdate(
      { id: projectId },
      { updatedAt: new Date() },
    );

    return res.status(201).json({
      data: toTaskDto(newTaskRecord),
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create task",
    });
  }
});

export default router;
