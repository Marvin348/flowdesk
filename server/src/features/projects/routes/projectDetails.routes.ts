import express from "express";
import { toProjectOverviewDto } from "@/features/projects/mappers/projectOverview.mapper.js";
import { toProjectCommentsDto } from "@/features/projects/mappers/projectComments.mapper.js";
import { toProjectUserWorkloadDto } from "@/features/projects/mappers/project-user-workload.mapper.js";
import { toProjectTasksDto } from "@/features/projects/mappers/projectTasks.mapper.js";
import { getProjectProgress } from "@/features/projects/utils/getProjectProgress.js";
import type { ProjectCollaboratorsQuery } from "@/features/projects/types/querys/projectCollaboratorsQuery.js";
import { Request } from "express";
import { sortedCollaborators } from "@/features/projects/utils/sortedCollaborators.js";
import { pagination } from "@/shared/utils/pagination.js";
import type { ProjectCommentsQuery } from "@/features/projects/types/querys/projectCommentsQuery.js";
import { sortedComments } from "@/features/projects/utils/sortedComments.js";
import { ProjectWorkloadQuery } from "@/features/projects/types/querys/projectWorkloadQuery.js";
import { parseProjectWorkloadSort } from "@shared/parsers/parseProjectWorkloadSort.js";
import { sortedWorkload } from "@/features/projects/utils/sortedWorkload.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { CommentModel } from "@/features/comments/models/comment.model.js";
import {
  toUserAvatarDto,
  toUserDto,
} from "@/features/users/mappers/user.mapper.js";
import { toCommentDto } from "@/features/comments/mappers/comment.mapper.js";
import { PAGE_LIMITS } from "@shared/constants/pagination.js";
import { parsePagination } from "@/shared/parsers/parsePagination.js";
import { getProjectById } from "@/features/projects/services/project.service.js";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { AppError } from "@/utils/AppError.js";
import mongoose from "mongoose";
import { projectDetailsParamsSchema } from "../validation/project.validator.js";
import { getProjectDetails } from "../services/details/getProjectDetails.service.js";
import { getProjectOverview } from "../services/details/getProjectOverview.service.js";
import { getProjectTasks } from "../services/details/getProjectTasks.service.js";
import { projectCollaboratorQuerySchema } from "../validation/projectCollaboratorSchema.validator.js";
import { getProjectCollaborators } from "../services/details/getProjectCollaborators.service.js";
import { projectCommentsQuerySchema } from "../validation/projectCommentsSchema.validator.js";
import { getProjectComments } from "../services/details/getProjectComments.service.js";

const router = express.Router();

const parseProjectObjectId = (projectId?: string) => {
  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    throw new AppError("Invalid projectId", 400);
  }

  return new mongoose.Types.ObjectId(projectId);
};

router.get(
  "/:projectId/details",
  asyncHandler(async (req: Request<{ projectId: string }>, res) => {
    const param = projectDetailsParamsSchema.safeParse(req.params);

    if (!param.success) {
      throw new AppError("Invalid projectId", 400);
    }

    const { workspaceId } = getAuthContext(req);

    const projectDetails = await getProjectDetails({
      workspaceId,
      projectId: param.data.projectId,
    });

    return res.status(200).json({
      data: projectDetails,
    });
  }),
);

router.get(
  "/:projectId/overview",
  asyncHandler(async (req: Request<{ id: string }>, res) => {
    const param = projectDetailsParamsSchema.safeParse(req.params);

    if (!param.success) {
      throw new AppError("Invalid projectId", 400);
    }

    const { workspaceId } = getAuthContext(req);

    const overview = await getProjectOverview({
      workspaceId,
      projectId: param.data.projectId,
    });

    return res.status(200).json({
      data: overview,
    });
  }),
);

router.get(
  "/:projectId/tasks",
  asyncHandler(async (req: Request<{ projectId: string }>, res) => {
    const param = projectDetailsParamsSchema.safeParse(req.params);

    if (!param.success) {
      throw new AppError("Invalid projectId", 400);
    }

    const { workspaceId } = getAuthContext(req);

    const projectTasks = await getProjectTasks({
      workspaceId,
      projectId: param.data.projectId,
    });

    return res.status(200).json({ data: projectTasks });
  }),
);

router.get(
  "/:projectId/collaborators",
  asyncHandler(
    async (
      req: Request<{ projectId: string }, {}, {}, ProjectCollaboratorsQuery>,
      res,
    ) => {
      const param = projectDetailsParamsSchema.safeParse(req.params);

      if (!param.success) {
        throw new AppError("Invalid projectId", 400);
      }

      const query = projectCollaboratorQuerySchema.safeParse(req.query);

      if (!query.success) {
        throw new AppError("Invalid query", 400);
      }

      const { workspaceId } = getAuthContext(req);

      const projectCollaborators = await getProjectCollaborators({
        workspaceId,
        projectId: param.data.projectId,
        query: query.data,
      });

      return res.status(200).json({ data: projectCollaborators });
    },
  ),
);

router.get(
  "/:projectId/comments",
  asyncHandler(
    async (
      req: Request<{ projectId: string }, {}, {}, ProjectCommentsQuery>,
      res,
    ) => {
      const param = projectDetailsParamsSchema.safeParse(req.params);

      if (!param.success) {
        throw new AppError("Invalid projectId", 400);
      }

      const query = projectCommentsQuerySchema.safeParse(req.query);

      if (!query.success) {
        throw new AppError("Invalid query", 400);
      }

      const { workspaceId } = getAuthContext(req);

      const projectComments = await getProjectComments({
        workspaceId,
        projectId: param.data.projectId,
        query: query.data,
      });

      return res.status(200).json({ data: projectComments });
    },
  ),
);

router.get(
  "/:id/workload",
  asyncHandler(
    async (
      req: Request<{ id?: string }, {}, {}, ProjectWorkloadQuery>,
      res,
    ) => {
      const projectId = req.params.id;

      const projectObjectId = parseProjectObjectId(projectId);

      const parsedWorkloadSort = parseProjectWorkloadSort(
        req.query.workloadSort,
      );

      const { workspaceId } = getAuthContext(req);

      const project = await getProjectById({
        projectId: projectObjectId,
        workspaceId,
      });

      if (!project) {
        throw new AppError("Project not found", 404);
      }

      const taskRecords = await TaskModel.find({
        projectId,
        workspaceId,
      }).lean();

      const tasks = taskRecords.map(toTaskDto);

      const collaboratorIds = new Set(
        tasks.flatMap((task) => task.collaboratorIds),
      );

      const userRecords = await UserModel.find({
        workspaceId,
        _id: { $in: [...collaboratorIds] },
      }).lean();

      const users = userRecords.map(toUserDto);
      const usersById = new Map(users.map((user) => [user.id, user]));

      const workload = toProjectUserWorkloadDto(tasks, usersById);
      const sorted = sortedWorkload(workload, parsedWorkloadSort);

      const { page, limit } = parsePagination({
        page: req.query.page,
        limit: req.query.limit,
        defaultLimit: PAGE_LIMITS.workload,
      });

      const paginationItems = pagination(sorted, page, limit);

      return res.status(200).json({ data: paginationItems });
    },
  ),
);
export default router;
