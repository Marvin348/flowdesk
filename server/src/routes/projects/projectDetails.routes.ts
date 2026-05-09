import express from "express";
import { readDb } from "@/utils/readDb.js";
import { getProjectOverview } from "@/utils/projects/getProjectOverview.js";
import { getProjectComments } from "@/utils/projects/getProjectComments.js";
import { getProjectUserWorkload } from "@/utils/projects/getProjectUserWorkload.js";
import { getProjectTasks } from "@/utils/projects/getProjectTasks.js";
import { getProjectProgress } from "@/utils/projects/getProjectProgress.js";
import { Request } from "express";

const router = express.Router();

router.get("/:id/details", (req: Request<{ id: string }>, res) => {
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
  const { progressPercent } = getProjectProgress(tasks);

  return res.status(200).json({
    data: {
      ...project,
      progressPercent,
    },
  });
});

router.get("/:id/overview", (req, res) => {
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
  const usersById = new Map(db.users.map((u) => [u.id, u]));

  const overview = getProjectOverview({
    project,
    comments: db.comments,
    tasks,
    usersById,
  });

  return res.status(200).json({
    data: overview,
  });
});

router.get("/:id/tasks", (req, res) => {
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
  const usersById = new Map(db.users.map((u) => [u.id, u]));

  const projectTasks = getProjectTasks(tasks, usersById);

  return res.status(200).json({ data: projectTasks });
});

router.get("/:id/collaborators", (req, res) => {
  const projectId = req.params.id;

  if (!projectId) {
    return res.status(400).json({ error: "Invalid projectId" });
  }

  const db = readDb();

  const project = db.projects.find((p) => p.id === projectId);

  if (!project) {
    return res.status(404).json({ error: "project not found" });
  }

  const invitedUserIdsSet = new Set(project.invitedUserIds);
  const collaborators = db.users.filter((user) =>
    invitedUserIdsSet.has(user.id),
  );

  return res.status(200).json({ data: collaborators });
});

router.get("/:id/comments", (req, res) => {
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

  const usersById = new Map(db.users.map((u) => [u.id, u]));
  const tasksById = new Map(tasks.map((t) => [t.id, t]));

  const comments = db.comments.filter((c) => tasksById.has(c.taskId));
  const projectComments = getProjectComments(comments, tasksById, usersById);

  return res.status(200).json({ data: projectComments });
});

router.get("/:id/workload", (req, res) => {
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
  const usersById = new Map(db.users.map((u) => [u.id, u]));

  const workload = getProjectUserWorkload(tasks, usersById);

  return res.status(200).json({ data: workload });
});

// files

export default router;
