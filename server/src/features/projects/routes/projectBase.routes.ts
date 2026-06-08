import express from "express";
import { toProjectsSummaryDto } from "@/features/projects/mappers/project-summary.mapper.js";
import { Request } from "express";
import type { ProjectSummaryQuery } from "@/features/projects/types/querys/projectSummaryQuery.js";
import { parseProjectQueryFilter } from "@/shared/parsers/project-query.parsers.js";
import { getFilteredProjectsList } from "@/features/projects/utils/getFilteredProjectsList.js";
import { pagination } from "@/shared/utils/pagination.js";
import type { CreateProjectInput } from "@shared/types/inputs/createProjectInput.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { CommentModel } from "@/features/comments/models/comment.model.js";
import { AttachmentModel } from "@/features/attachments/models/attachment.model.js";
import { toProjectDto } from "@/features/projects/mappers/project.mapper.js";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper.js";
import { toCommentDto } from "@/features/comments/mappers/comment.mapper.js";
import { toAttachmentDto } from "@/features/attachments/mappers/attachment.mapper.js";
import { PAGE_LIMITS } from "@shared/constants/pagination.js";
import { parsePagination } from "@/shared/parsers/parsePagination.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { toUserDto } from "@/features/users/mappers/user.mapper.js";
import {
  getProjectById,
  getProjects,
} from "@/features/projects/services/project.service.js";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { userId, workspaceId } = getAuthContext(req);

  const projects = await getProjects({ userId, workspaceId });

  return res.status(200).json({ data: projects });
});

router.get(
  "/summaries",
  async (req: Request<{}, {}, {}, ProjectSummaryQuery>, res) => {
    try {
      const { userId, workspaceId } = getAuthContext(req);

      const projects = await getProjects({ userId, workspaceId });
      const projectIds = projects.map((project) => project.id);

      const taskDocs = await TaskModel.find({
        workspaceId,
        projectId: { $in: projectIds },
      }).lean();
      const taskIds = taskDocs.map((task) => task._id.toString());

      const commentDocs = await CommentModel.find({
        workspaceId,
        taskId: { $in: taskIds },
      }).lean();

      const attachmentDocs = await AttachmentModel.find({
        workspaceId,
        projectId: { $in: projectIds },
      }).lean();

      const userDocs = await UserModel.find({ workspaceId }).lean();

      const tasks = taskDocs.map(toTaskDto);
      const comments = commentDocs.map(toCommentDto);
      const attachments = attachmentDocs.map(toAttachmentDto);
      const users = userDocs.map(toUserDto);

      const usersById = new Map(users.map((u) => [u.id, u]));

      const projectListItems = toProjectsSummaryDto(
        projects,
        tasks,
        comments,
        attachments,
        usersById,
      );

      const search =
        typeof req.query.search === "string" ? req.query.search.trim() : "";

      const parsedFilter = parseProjectQueryFilter(req.query);

      const filteredProjects = getFilteredProjectsList(
        projectListItems,
        search,
        parsedFilter,
      );

      const { page, limit } = parsePagination({
        page: req.query.page,
        limit: req.query.limit,
        defaultLimit: PAGE_LIMITS.attachments,
      });

      const paginationItems = pagination(filteredProjects, page, limit);

      return res.status(200).json({ data: paginationItems });
    } catch (error) {
      return res.status(500).json({
        error: "Failed to fetch project summaries",
      });
    }
  },
);

router.post("/", async (req: Request<{}, {}, CreateProjectInput>, res) => {
  try {
    const {
      title,
      priority,
      projectStatus,
      dueDate,
      invitedUserIds,
      description,
    } = req.body;

    const { userId, workspaceId } = getAuthContext(req);

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
      workspaceId,
      title,
      priority,
      ownerId: userId,
      projectStatus,
      dueDate,
      invitedUserIds,
      description,
    });

    return res.status(201).json({ data: toProjectDto(newProject.toObject()) });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to add new project",
    });
  }
});

router.get("/:id", async (req: Request<{ id: string }>, res) => {
  const projectId = req.params.id;

  if (!projectId) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const { userId, workspaceId } = getAuthContext(req);

  const project = await getProjectById({
    projectId,
    userId,
    workspaceId,
  });

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

    const { userId, workspaceId } = getAuthContext(req);

    const project = await getProjectById({
      projectId,
      userId,
      workspaceId,
    });

    if (!project) {
      return res.status(404).json({ error: "project not found" });
    }

    const tasksToDelete = await TaskModel.find({ projectId, workspaceId });
    const taskIdsToDelete = tasksToDelete.map((t) => t._id.toString());

    await CommentModel.deleteMany({
      workspaceId,
      taskId: { $in: taskIdsToDelete },
    });

    await AttachmentModel.deleteMany({
      workspaceId,
      projectId,
    });

    await TaskModel.deleteMany({ projectId, workspaceId });

    const deletedProject = await ProjectModel.findOneAndDelete({
      workspaceId,
      _id: projectId,
    });

    return res.status(201).json({ data: deletedProject });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;
