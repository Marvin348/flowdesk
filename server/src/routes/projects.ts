import express from "express";
import { readDb } from "@/utils/readDb.js";
import { writeDb } from "@/utils/writeDb.js";
import type {
  ProjectDetailsDto,
  ProjectSummariesDto,
  ProjectOptionDto,
  ProjectOptionsDto,
} from "@shared/types/dto/project.js";
import type { CreateProjectInput } from "@shared/types/inputs/createProjectInput.js";
import { Project } from "@shared/types/project.js";
import type { Request, Response } from "express";
import { getProjectsSummary } from "@/utils/projects/getProjectsSummary.js";
import { getFilteredProjectsList } from "@/utils/projects/getFilteredProjectsList.js";
import { pagination } from "@/utils/pagination.js";
import { parseProjectQueryFilter } from "@/parsers/project-query.parsers.js";
import type { ProjectSummaryQuery } from "@/types/querys/projectSummaryQuery.js";

const router = express.Router();

router.get("/", (req, res) => {
  const db = readDb();
  res.json({ data: db.projects });
});

router.get(
  "/summaries",
  (req: Request<{}, {}, {}, ProjectSummaryQuery>, res) => {
    const db = readDb();

    const projects = db.projects;
    const comments = db.comments;
    const tasks = db.tasks;
    const attachments = db.attachments;

    const projectListItems = getProjectsSummary(
      projects,
      tasks,
      comments,
      attachments,
    );

    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const parsedFilter = parseProjectQueryFilter(req.query);

    const filteredProjects = getFilteredProjectsList(
      projectListItems,
      search,
      parsedFilter,
    );

    let page = Number(req.query.page);
    let limit = Number(req.query.limit);

    if (isNaN(page)) page = 1;
    if (isNaN(limit)) limit = 9;

    const paginationItems = pagination(filteredProjects, page, limit);

    return res.status(200).json({ data: paginationItems });
  },
);

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

router.get(
  "/options",
  (req: Request<{}, {}, {}, { search?: string; userId?: string }>, res) => {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
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
  },
);

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

// details vm
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

// scoped
router.get("/:id", (req: Request<{ id: string }>, res) => {
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
router.delete("/:id", (req: Request<{ id: string }>, res) => {
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
