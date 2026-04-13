import express from "express";
import { readDb } from "@/utils/readDb.js";
import { writeDb } from "@/utils/writeDb.js";
import type {
  ProjectDetailsDto,
  ProjectSummaryDto,
} from "@shared/types/dto/project.js";
import type { CreateProjectInput } from "@shared/types/inputs/createProjectInput.js";
import { Project } from "@shared/types/project.js";
import type { Request, Response } from "express";

const router = express.Router();

router.get("/", (req, res) => {
  const db = readDb();
  res.json({ data: db.projects });
});

// list vm
router.get("/summary", (req: Request<{}, {}, ProjectSummaryDto>, res) => {
  const db = readDb();

  const projects = db.projects;
  const comments = db.comments;
  const tasks = db.tasks;
  const attachments = db.attachments;

  // refactor later
  const tasksByProjectId = new Map<string, typeof tasks>();
  for (const task of tasks) {
    const existing = tasksByProjectId.get(task.projectId) ?? [];
    existing.push(task);
    tasksByProjectId.set(task.projectId, existing);
  }

  const commentsByTaskId = new Map<string, typeof comments>();
  for (const comment of comments) {
    const existing = commentsByTaskId.get(comment.taskId) ?? [];
    existing.push(comment);
    commentsByTaskId.set(comment.taskId, existing);
  }

  const attachmentsByTaskId = new Map<string, typeof attachments>();
  for (const attachment of attachments) {
    const existing = attachmentsByTaskId.get(attachment.taskId) ?? [];
    existing.push(attachment);
    attachmentsByTaskId.set(attachment.taskId, existing);
  }

  const projectListItems = projects.map((p): ProjectSummaryDto => {
    const projectTasks = tasksByProjectId.get(p.id) ?? [];

    const teamUserIdSet = new Set<string>(p.invitedUserIds);

    const counts = projectTasks.reduce(
      (acc, task) => {
        acc.commentCount += (commentsByTaskId.get(task.id) ?? []).length;
        acc.attachmentCount += (attachmentsByTaskId.get(task.id) ?? []).length;

        if (task.taskStatus === "done") {
          acc.completedTaskCount += 1;
        }

        for (const userId of task.collaboratorIds) {
          teamUserIdSet.add(userId);
        }

        return acc;
      },
      {
        commentCount: 0,
        attachmentCount: 0,
        completedTaskCount: 0,
      },
    );

    const teamUserIds = Array.from(teamUserIdSet);

    return {
      id: p.id,
      title: p.title,
      priority: p.priority,
      projectStatus: p.projectStatus,
      dueDate: p.dueDate,
      teamUserIds,
      createdAt: p.createdAt,

      stats: {
        taskCount: projectTasks.length,
        commentCount: counts.commentCount,
        attachmentCount: counts.attachmentCount,
        completedTaskCount: counts.completedTaskCount,
        userCount: teamUserIds.length,
      },
    };
  });

  return res.status(200).json({ data: projectListItems });
});

// create new project
router.post("/", (req: Request<{}, {}, CreateProjectInput>, res) => {
  const {
    title,
    priority,
    projectStatus,
    dueDate,
    invitedUserIds,
    description,
  } = req.body;

  if (
    !title ||
    !priority ||
    !projectStatus ||
    !dueDate ||
    !Array.isArray(invitedUserIds)
  ) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const db = readDb();

  const newProject: Project = {
    id: crypto.randomUUID(),
    title,
    priority,
    projectStatus,
    dueDate,
    invitedUserIds,
    description,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  db.projects.push(newProject);

  writeDb(db);

  return res.status(201).json({ data: newProject });
});

// details vm
router.get(
  "/:id/details",
  (req: Request<{ id: string }, {}, ProjectDetailsDto>, res) => {
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
  },
);

// PATCH /users/:id/role //chage user globally
// chage user-role
router.patch("/:id/members/:userId", (req, res) => {
  const projectId = req.params.id;
  const userId = req.params.userId;

  if (!projectId || !userId) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const db = readDb();
  const project = db.projects.find((p) => p.id === projectId);

  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  const user = db.users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!project.invitedUserIds.includes(userId)) {
    return res.status(400).json({ error: "User not in project" });
  }

  // not ready
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

// delete project
router.delete("/:id", (req, res) => {
  const projectId = req.params.id;

  if (!projectId) {
    return res.status(400).json({ error: "projectId invalid input" });
  }

  const db = readDb();
  const index = db.projects.findIndex((p) => p.id === projectId);

  if (index === -1) {
    return res.status(404).json({ error: "project not found" });
  }

  const deletedProject = db.projects.splice(index, 1);

  const taskIdsToDelete = db.tasks
    .filter((t) => t.projectId === projectId)
    .map((t) => t.id);

  const taskIdSet = new Set(taskIdsToDelete);

  db.tasks = db.tasks.filter((t) => !taskIdSet.has(t.id));
  db.comments = db.comments.filter((c) => !taskIdSet.has(c.taskId));
  db.attachments = db.attachments.filter((a) => !taskIdSet.has(a.taskId));

  writeDb(db);

  return res.json({ data: deletedProject[0] });
});

// update invitedUserIds
router.patch("/:id", (req, res) => {
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
});

export default router;
