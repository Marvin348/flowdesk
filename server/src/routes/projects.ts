import express from "express";
import { readDb } from "@/utils/readDb.js";
import { writeDb } from "@/utils/writeDb.js";
import type {
  ProjectDetailsDto,
  ProjectSummaryDto,
  ProjectOptionDto,
  ProjectOptionsDto,
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


router.get("/options", (req: Request<{}, {}, ProjectOptionsDto>, res) => {
  const search = typeof req.query.search === "string" ? req.query.search : "";
  const userId = req.query.userId;

  const db = readDb();

  const projectOption: ProjectOptionDto[] = db.projects.map((p) => {
    const invitedUserIdsSet = new Set<string>(p.invitedUserIds);

    const isInvited = p.invitedUserIds.some((ids) => ids === userId);

    const users = db.users
      .filter((u) => invitedUserIdsSet.has(u.id))
      .map((u) => {
        return {
          id: u.id,
          name: u.name,
          avatarKey: u.avatarKey,
        };
      });

    return {
      id: p.id,
      title: p.title,
      createdAt: p.createdAt,
      isInvited,
      users,
    };
  });

  const recent = projectOption
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  const recentIdSet = new Set(recent.map((p) => p.id));

  const filteredProjectOptions = projectOption
    .filter((p) => {
      if (recentIdSet.has(p.id)) return false;

      const matchesSearch =
        !search || p.title.toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    })
    .slice(0, 5);

  return res.status(200).json({
    data: {
      recent: recent,
      results: search === "" ? [] : filteredProjectOptions,
    },
  });
});

// add new userId to projects
router.patch("/assign-user", (req, res) => {
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

// update invitedUserIds
router.patch("/:id/members", (req, res) => {
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

export default router;
