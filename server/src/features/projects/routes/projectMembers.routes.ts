import express from "express";
import { writeDb } from "@/shared/utils/writeDb.js";
import { readDb } from "@/shared/utils/readDb.js";
import { Request } from "express";

const router = express.Router();

type AssignUserInput = {
  projectIdsToAdd: string[];
  userId: string;
};

// add new userId to projects
router.patch("/assign-user", (req: Request<{}, {}, AssignUserInput>, res) => {
  const { projectIdsToAdd, userId } = req.body;

  if (!Array.isArray(projectIdsToAdd) || typeof userId !== "string") {
    return res.status(400).json({ error: "Invalid input" });
  }

  const db = readDb();

  const user = db.users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const projectIdsToAddSet = new Set(projectIdsToAdd);
  const matchesProjects = db.projects.filter((p) =>
    projectIdsToAddSet.has(p.id),
  );

  if (projectIdsToAddSet.size !== matchesProjects.length) {
    return res.status(400).json({ error: "one or more projects are missing" });
  }

  for (const p of matchesProjects) {
    const invitedUserIdsSet = new Set(p.invitedUserIds);

    if (invitedUserIdsSet.has(userId)) {
      return res.status(409).json({ error: "User already in project" });
    }

    const updatedUserIds = Array.from(new Set([...p.invitedUserIds, userId]));

    p.invitedUserIds = updatedUserIds;
    p.updatedAt = new Date().toISOString();
  }

  writeDb(db);

  return res.json({ data: matchesProjects });
});

// delete user from project
router.delete("/:id/members/:userId", (req, res) => {
  const projectId = req.params.id;

  if (!projectId) {
    return res.status(400).json({ error: "Invalid projectId" });
  }

  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  const db = readDb();

  const project = db.projects.find((p) => p.id === projectId);

  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  if (!project.invitedUserIds.includes(userId)) {
    return res.status(400).json({ error: "User is not a project member" });
  }

  project.invitedUserIds = project.invitedUserIds.filter((id) => id !== userId);

  const deleteSet = new Set<string>();

  for (const task of db.tasks) {
    if (task.projectId !== projectId) continue;
    if (!task.collaboratorIds.includes(userId)) continue;

    task.collaboratorIds = task.collaboratorIds.filter((id) => id !== userId);

    if (!task.collaboratorIds.length) {
      deleteSet.add(task.id);
    }
  }

  db.tasks = db.tasks.filter((t) => !deleteSet.has(t.id));
  db.attachments = db.attachments.filter((a) => !deleteSet.has(a.taskId));
  db.comments = db.comments.filter((c) => !deleteSet.has(c.taskId));

  project.updatedAt = new Date().toISOString();

  writeDb(db);

  return res.status(200).json({ data: project });
});

// update invitedUserIds
router.patch(
  "/:id/members",
  (req: Request<{ id: string }, {}, { userIdsToAdd: string[] }>, res) => {
    const projectId = req.params.id;
    const { userIdsToAdd } = req.body;

    if (!projectId || !Array.isArray(userIdsToAdd)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const db = readDb();
    const project = db.projects.find((p) => p.id === projectId);

    if (!project) {
      return res.status(404).json({ error: "project not found" });
    }

    project.invitedUserIds = Array.from(
      new Set([...project.invitedUserIds, ...userIdsToAdd]),
    );

    project.updatedAt = new Date().toISOString();

    writeDb(db);

    return res.status(200).json({ data: project });
  },
);

export default router;
