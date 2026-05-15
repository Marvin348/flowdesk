import express from "express";
import { readDb } from "@/shared/utils/readDb.js";
import { getProjectsSummary } from "@/features/projects/utils/getProjectsSummary.js";
import { Request } from "express";
import type { ProjectSummaryQuery } from "@/features/projects/types/querys/projectSummaryQuery.js";
import { parseProjectQueryFilter } from "@/shared/parsers/project-query.parsers.js";
import { getFilteredProjectsList } from "@/features/projects/utils/getFilteredProjectsList.js";
import { pagination } from "@/shared/utils/pagination.js";
import type { CreateProjectInput } from "@shared/types/inputs/createProjectInput.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { CommentModel } from "@/features/comments/models/comment.model.js";
import { AttachmentModel } from "@/features/attchments/models/attachment.model.js";
import { toProjectDto } from "@/features/projects/mappers/project.mapper.js";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper.js";
import { toCommentDto } from "@/features/comments/mappers/comment.mapper.js";
import { toAttachmentDto } from "@/features/attchments/mappers/attachment.mapper.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const projects = await ProjectModel.find();

  return res.status(200).json({ data: projects });
});

router.get(
  "/summaries",
  async (req: Request<{}, {}, {}, ProjectSummaryQuery>, res) => {
    try {
      const projectDocs = await ProjectModel.find().lean();
      const taskDocs = await TaskModel.find().lean();
      const commentDocs = await CommentModel.find().lean();
      const attachmentDocs = await AttachmentModel.find().lean();

      const projects = projectDocs.map(toProjectDto);
      const tasks = taskDocs.map(toTaskDto);
      const comments = commentDocs.map(toCommentDto);
      const attachments = attachmentDocs.map(toAttachmentDto);

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
    } catch (error) {
      return res.status(500).json({
        error: "Failed to fetch project summaries",
      });
    }
  },
);

// create new project
router.post("/", async (req: Request<{}, {}, CreateProjectInput>, res) => {
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

  const newProject = await ProjectModel.create({
    id: crypto.randomUUID(),
    title,
    priority,
    projectStatus,
    dueDate,
    invitedUserIds,
    description,
  });

  return res.status(201).json({ data: newProject });
});

router.get("/:id", async (req: Request<{ id: string }>, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const project = await ProjectModel.findOne({ id });

  if (!project) {
    return res.status(404).json({ error: "project not found" });
  }

  return res.status(200).json({ data: project });
});

router.delete("/:id", async (req: Request<{ id: string }>, res) => {
  try {
    const projectId = req.params.id;

    if (!projectId) {
      return res.status(400).json({ error: "projectId invalid input" });
    }

    const project = await ProjectModel.findOne({ id: projectId });

    if (!project) {
      return res.status(404).json({ error: "project not found" });
    }

    const tasksToDelete = await TaskModel.find({ projectId });
    const taskIdsToDelete = tasksToDelete.map((t) => t.id);

    await CommentModel.deleteMany({
      taskId: { $in: taskIdsToDelete },
    });

    await AttachmentModel.deleteMany({
      taskId: { $in: taskIdsToDelete },
    });

    await TaskModel.deleteMany({ projectId });

    const deletedProject = await ProjectModel.findOneAndDelete({
      id: projectId,
    });

    return res.status(201).json({ data: deletedProject });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;
