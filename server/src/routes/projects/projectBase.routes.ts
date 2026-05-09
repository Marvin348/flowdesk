import express from "express";
import { readDb } from "@/utils/readDb.js";
import { writeDb } from "@/utils/writeDb.js";
import { getProjectsSummary } from "@/utils/projects/getProjectsSummary.js";
import { Request } from "express";
import type { ProjectSummaryQuery } from "@/types/querys/projectSummaryQuery.js";
import { parseProjectQueryFilter } from "@/parsers/project-query.parsers.js";
import { getFilteredProjectsList } from "@/utils/projects/getFilteredProjectsList.js";
import { pagination } from "@/utils/pagination.js";
import type { CreateProjectInput } from "@shared/types/inputs/createProjectInput.js";
import type { Project } from "@shared/types/project.js";

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
