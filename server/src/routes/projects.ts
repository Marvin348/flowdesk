import express from "express";
import { readDb } from "../utils/readDb.js";

const router = express.Router();

// test
router.get("/", (req, res) => {
  const db = readDb();
  res.json(db.projects);
});

// scoped
router.get("/:id", (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const db = readDb();

  const project = db.projects.find((p) => p.id === id);

  if (!project) {
    return res.status(404).json({ error: "project not found" });
  }

  return res.status(200).json({ data: project });
});

// all endpoints
router.get("/:id/details", (req, res) => {
  const projectId = req.params.id;

  if (!projectId) {
    return res.status(400).json({ error: "Invalid projectId" });
  }

  const db = readDb();

  const project = db.projects.find((p) => p.id === projectId);

  if (!project) {
    return res.status(404).json({ error: "project not found" });
  }

  const tasks = db.tasks.filter((t) => t.projectId === projectId);
  const tasksByIds = new Set(tasks.map((t) => t.id));

  const comments = db.comments.filter((c) => tasksByIds.has(c.taskId));
  const attachments = db.attachments.filter((a) => tasksByIds.has(a.taskId));

  const users = db.users;

  return res.status(200).json({
    data: {
      project,
      tasks,
      comments,
      attachments,
      users,
    },
  });
});

export default router;
