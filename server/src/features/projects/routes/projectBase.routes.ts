import express from "express";
import { toProjectsSummaryDto } from "@/features/projects/mappers/project-summary.mapper.js";
import { Request } from "express";
import type { ProjectSummaryQuery } from "@/features/projects/types/querys/projectSummaryQuery.js";
import { parseProjectQueryFilter } from "@/shared/parsers/project-query.parsers.js";
import { getFilteredProjectsList } from "@/features/projects/utils/getFilteredProjectsList.js";
import { pagination } from "@/shared/utils/pagination.js";
import type { CreateProjectInput } from "@shared/types/inputs/createProjectInput.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { CommentModel } from "@/features/comments/models/comment.model.js";
import { AttachmentModel } from "@/features/attachments/models/attachment.model.js";
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
import { asyncHandler } from "@/utils/asyncHandler.js";
import { AppError } from "@/utils/AppError.js";
import { createProjectSchema } from "@/features/projects/validation/project.validator.js";
import { createProject } from "@/features/projects/services/createProject.service.js";
import { deleteProject } from "@/features/projects/services/deleteProject.service.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { userId, workspaceId } = getAuthContext(req);

    const projects = await getProjects({ userId, workspaceId });

    return res.status(200).json({ data: projects });
  }),
);

router.get(
  "/summaries",
  asyncHandler(async (req: Request<{}, {}, {}, ProjectSummaryQuery>, res) => {
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
  }),
);

router.post(
  "/",
  asyncHandler(async (req: Request<{}, {}, CreateProjectInput>, res) => {
    const result = createProjectSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError("Invalid input", 400);
    }

    const { userId, workspaceId } = getAuthContext(req);

    const newProject = await createProject({
      input: result.data,
      workspaceId,
      userId,
    });

    return res.status(201).json({ data: newProject });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req: Request<{ id?: string }>, res) => {
    const projectId = req.params.id;

    if (!projectId) {
      throw new AppError("Invalid id", 400);
    }

    const { userId, workspaceId } = getAuthContext(req);

    const project = await getProjectById({
      projectId,
      userId,
      workspaceId,
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    return res.status(200).json({ data: project });
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req: Request<{ id?: string }>, res) => {
    const projectId = req.params.id;

    if (!projectId) {
      throw new AppError("projectId invalid input", 400);
    }

    const { userId, workspaceId } = getAuthContext(req);

    const deletedProject = await deleteProject({
      projectId,
      userId,
      workspaceId,
    });

    return res.status(201).json({ data: deletedProject });
  }),
);

export default router;
