import express from "express";
import { readDb } from "@/utils/readDb.js";
import { getProjectOverview } from "@/utils/projects/getProjectOverview.js";
import { getProjectComments } from "@/utils/projects/getProjectComments.js";
import { getProjectUserWorkload } from "@/utils/projects/getProjectUserWorkload.js";
import { getProjectTasks } from "@/utils/projects/getProjectTasks.js";
import { getProjectProgress } from "@/utils/projects/getProjectProgress.js";
import { parseCollaboratorSort } from "@shared/parsers/parseCollaboratorSort.js";
import type { ProjectCollaboratorsQuery } from "@/types/querys/projectCollaboratorsQuery.js";
import { Request } from "express";
import { sortedCollaborators } from "@/utils/projects/sortedCollaborators.js";
import { pagination } from "@/utils/pagination.js";
import type { ProjectCommentsQuery } from "@/types/querys/projectCommentsQuery.js";
import { sortedComments } from "@/utils/projects/sortedComments.js";
import { parseProjectCommentsSort } from "@shared/parsers/parseProjectCommentsSort.js";
import { ProjectWorkloadQuery } from "@/types/querys/projectWorkloadQuery.js";
import { parseProjectWorkloadSort } from "@shared/parsers/parseProjectWorkloadSort.js";
import { sortedWorkload } from "@/utils/projects/sortedWorkload.js";

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

router.get(
  "/:id/collaborators",
  (req: Request<{ id: string }, {}, {}, ProjectCollaboratorsQuery>, res) => {
    const projectId = req.params.id;
    const { collaboratorsSort, page, limit } = req.query;

    if (!projectId) {
      return res.status(400).json({ error: "Invalid projectId" });
    }

    const parsedCollaboratorSort = parseCollaboratorSort(collaboratorsSort);

    const db = readDb();

    const project = db.projects.find((p) => p.id === projectId);

    if (!project) {
      return res.status(404).json({ error: "project not found" });
    }

    const invitedUserIdsSet = new Set(project.invitedUserIds);
    const collaborators = db.users.filter((user) =>
      invitedUserIdsSet.has(user.id),
    );

    const sorted = sortedCollaborators(collaborators, parsedCollaboratorSort);

    let currentPage = Number(page);
    let currentLimit = Number(limit);

    if (isNaN(currentPage)) currentPage = 1;
    if (isNaN(currentLimit)) currentLimit = 9;

    const paginationItems = pagination(sorted, currentPage, currentLimit);

    return res.status(200).json({ data: paginationItems });
  },
);

router.get(
  "/:id/comments",
  (req: Request<{ id: string }, {}, {}, ProjectCommentsQuery>, res) => {
    const projectId = req.params.id;

    const { commentsSort } = req.query;

    const parseCommentsSort = parseProjectCommentsSort(commentsSort);

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

    const limit = Number(req.query.limit) || 8;

    const sorted = sortedComments(projectComments.comments, parseCommentsSort);
    const limited = sorted.slice(0, limit);

    return res.status(200).json({
      data: {
        comments: limited,
        taskOptions: projectComments.taskOptions,
        totalItems: sorted.length,
        hasMore: limited.length < sorted.length,
      },
    });
  },
);

router.get(
  "/:id/workload",
  (req: Request<{ id: string }, {}, {}, ProjectWorkloadQuery>, res) => {
    const projectId = req.params.id;

    if (!projectId) {
      return res.status(400).json({ error: "Invalid projectId" });
    }

    const parseWorkloadSort = parseProjectWorkloadSort(req.query.workloadSort);

    const db = readDb();

    const project = db.projects.find((p) => p.id === projectId);

    if (!project) {
      return res.status(404).json({ error: "project not found" });
    }

    const tasks = db.tasks.filter((t) => t.projectId === projectId);
    const usersById = new Map(db.users.map((u) => [u.id, u]));

    const workload = getProjectUserWorkload(tasks, usersById);
    const sorted = sortedWorkload(workload, parseWorkloadSort);

    let page = Number(req.query.page);
    let limit = Number(req.query.limit);

    if (isNaN(page)) page = 1;
    if (isNaN(limit)) limit = 9;

    const paginationItems = pagination(sorted, page, limit);

    return res.status(200).json({ data: paginationItems });
  },
);

// files

export default router;
