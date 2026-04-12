import express from "express";
import { readDb } from "../utils/readDb.js";
import { writeDb } from "../utils/writeDb.js";
import { Task } from "../types/index.js";

const router = express.Router();

router.get("/", (req, res) => {
  const db = readDb();
  res.json({ data: db.tasks });
});

// post in details
router.post("/", (req, res) => {
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

  const db = readDb();

  const project = db.projects.find((p) => p.id === projectId);

  if (!project) {
    return res.status(404).json({ error: "project not found" });
  }

  const newTask: Task = {
    id: crypto.randomUUID(),
    projectId,
    title,
    dueDate,
    taskStatus: "pending",
    collaboratorIds,
    taskPriority,
    description: description ?? "",
    tags: tags ?? [],
    reminderAt: reminderAt ?? "none",
  };

  db.tasks.push(newTask);

  project.updatedAt = new Date().toISOString();

  writeDb(db);

  return res.status(201).json({ data: newTask });
});

export default router;
