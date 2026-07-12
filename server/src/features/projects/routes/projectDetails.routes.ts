import express from "express";
import { toProjectOverviewDto } from "@/features/projects/mappers/project-overview.mapper.js";
import { toProjectCommentsDto } from "@/features/projects/mappers/project-comments.mapper.js";
import { toProjectUserWorkloadDto } from "@/features/projects/mappers/project-user-workload.mapper.js";
import { toProjectTasksDto } from "@/features/projects/mappers/project-tasks.mapper.js";
import { getProjectProgress } from "@/features/projects/utils/getProjectProgress.js";
import { parseCollaboratorSort } from "@shared/parsers/parseCollaboratorSort.js";
import type { ProjectCollaboratorsQuery } from "@/features/projects/types/querys/projectCollaboratorsQuery.js";
import { Request } from "express";
import { sortedCollaborators } from "@/features/projects/utils/sortedCollaborators.js";
import { pagination } from "@/shared/utils/pagination.js";
import type { ProjectCommentsQuery } from "@/features/projects/types/querys/projectCommentsQuery.js";
import { sortedComments } from "@/features/projects/utils/sortedComments.js";
import { parseProjectCommentsSort } from "@shared/parsers/parseProjectCommentsSort.js";
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

const router = express.Router();

const parseProjectObjectId = (projectId?: string) => {
  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    throw new AppError("Invalid projectId", 400);
  }

  return new mongoose.Types.ObjectId(projectId);
};

router.get(
  "/:id/details",
  asyncHandler(async (req: Request<{ id?: string }>, res) => {
    const projectId = req.params.id;

    const projectObjectId = parseProjectObjectId(projectId);

    const { workspaceId } = getAuthContext(req);

    const project = await getProjectById({
      projectId: projectObjectId,
      workspaceId,
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    const taskRecords = await TaskModel.find({ projectId, workspaceId }).lean();

    const tasks = taskRecords.map(toTaskDto);

    const { progressPercent } = getProjectProgress(tasks);

    const invitedUserIdsSet = Array.from(new Set(project.invitedUserIds));

    const usersRecord = await UserModel.find({
      workspaceId,
      _id: { $in: invitedUserIdsSet },
    }).lean();

    const invitedUsers = usersRecord.map(toUserAvatarDto);

    return res.status(200).json({
      data: {
        ...project,
        invitedUsers,
        progressPercent,
      },
    });
  }),
);

router.get(
  "/:id/overview",
  asyncHandler(async (req: Request<{ id?: string }>, res) => {
    const projectId = req.params.id;

    const projectObjectId = parseProjectObjectId(projectId);

    const { workspaceId } = getAuthContext(req);

    const project = await getProjectById({
      projectId: projectObjectId,
      workspaceId,
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    const taskRecords = await TaskModel.find({ projectId, workspaceId }).lean();

    const tasks = taskRecords.map(toTaskDto);

    const taskIds = tasks.map((task) => task.id);

    const commentsRecords =
      taskIds.length > 0
        ? await CommentModel.find({
            workspaceId,
            taskId: { $in: taskIds },
          }).lean()
        : [];

    const userRecords = await UserModel.find({ workspaceId }).lean();

    const users = userRecords.map(toUserDto);
    const comments = commentsRecords.map(toCommentDto);

    const usersById = new Map(users.map((u) => [u.id, u]));

    const overview = toProjectOverviewDto({
      project,
      comments,
      tasks,
      usersById,
    });

    return res.status(200).json({
      data: overview,
    });
  }),
);

router.get(
  "/:id/tasks",
  asyncHandler(async (req: Request<{ id?: string }>, res) => {
    const projectId = req.params.id;

    const projectObjectId = parseProjectObjectId(projectId);

    const { workspaceId } = getAuthContext(req);

    const project = await getProjectById({
      projectId: projectObjectId,
      workspaceId,
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    const taskRecords = await TaskModel.find({ projectId, workspaceId }).lean();
    const userRecords = await UserModel.find({ workspaceId }).lean();

    const tasks = taskRecords.map(toTaskDto);
    const users = userRecords.map(toUserDto);

    const usersById = new Map(users.map((u) => [u.id, u]));

    const projectTasks = toProjectTasksDto(tasks, usersById);

    return res.status(200).json({ data: projectTasks });
  }),
);

router.get(
  "/:id/collaborators",
  asyncHandler(
    async (
      req: Request<{ id?: string }, {}, {}, ProjectCollaboratorsQuery>,
      res,
    ) => {
      const projectId = req.params.id;
      const { collaboratorsSort } = req.query;

      const projectObjectId = parseProjectObjectId(projectId);

      const parsedCollaboratorSort = parseCollaboratorSort(collaboratorsSort);

      const { workspaceId } = getAuthContext(req);

      const project = await getProjectById({
        projectId: projectObjectId,
        workspaceId,
      });

      if (!project) {
        throw new AppError("Project not found", 404);
      }

      const userRecords = await UserModel.find({
        workspaceId,
        _id: { $in: project.invitedUserIds },
      }).lean();

      const collaborators = userRecords.map(toUserDto);
      const sorted = sortedCollaborators(collaborators, parsedCollaboratorSort);

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

router.get(
  "/:id/comments",
  asyncHandler(
    async (
      req: Request<{ id?: string }, {}, {}, ProjectCommentsQuery>,
      res,
    ) => {
      const projectId = req.params.id;
      const { commentsSort } = req.query;

      const projectObjectId = parseProjectObjectId(projectId);

      const { workspaceId } = getAuthContext(req);

      const parsedCommentsSort = parseProjectCommentsSort(commentsSort);

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

      const taskIds = tasks.map((task) => task.id);

      const commentRecords = await CommentModel.find({
        workspaceId,
        taskId: { $in: taskIds },
      }).lean();

      const userRecords = await UserModel.find({ workspaceId }).lean();

      const comments = commentRecords.map(toCommentDto);
      const users = userRecords.map(toUserDto);

      const usersById = new Map(users.map((u) => [u.id, u]));
      const tasksById = new Map(tasks.map((task) => [task.id, task]));

      const projectComments = toProjectCommentsDto(
        comments,
        tasksById,
        usersById,
      );

      const limit = Number(req.query.limit) || 8;

      const sorted = sortedComments(
        projectComments.comments,
        parsedCommentsSort,
      );

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
