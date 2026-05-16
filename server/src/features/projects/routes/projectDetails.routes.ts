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
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper.js";
import { toProjectDto } from "@/features/projects/mappers/project.mapper.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { CommentModel } from "@/features/comments/models/comment.model.js";
import { toUserDto } from "@/features/users/mappers/user.mapper.js";
import { toCommentDto } from "@/features/comments/mappers/comment.mapper.js";

const router = express.Router();

router.get("/:id/details", async (req: Request<{ id: string }>, res) => {
  try {
    const projectId = req.params.id;

    if (!projectId) {
      return res.status(400).json({ error: "Invalid projectId" });
    }

    const projectRecord = await ProjectModel.findOne({ id: projectId }).lean();

    if (!projectRecord) {
      return res.status(404).json({ error: "project not found" });
    }

    const taskRecords = await TaskModel.find({ projectId }).lean();

    const project = toProjectDto(projectRecord);
    const tasks = taskRecords.map(toTaskDto);

    const { progressPercent } = getProjectProgress(tasks);

    return res.status(200).json({
      data: {
        ...project,
        progressPercent,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch project details",
    });
  }
});

router.get("/:id/overview", async (req, res) => {
  try {
    const projectId = req.params.id;

    if (!projectId) {
      return res.status(400).json({ error: "Invalid projectId" });
    }

    const projectRecord = await ProjectModel.findOne({ id: projectId }).lean();

    if (!projectRecord) {
      return res.status(404).json({ error: "project not found" });
    }

    const taskRecords = await TaskModel.find({ projectId }).lean();

    const project = toProjectDto(projectRecord);
    const tasks = taskRecords.map(toTaskDto);

    const taskIds = tasks.map((task) => task.id);

    const commentsRecords =
      taskIds.length > 0
        ? await CommentModel.find({
            taskId: { $in: taskIds },
          }).lean()
        : [];

    const userRecords = await UserModel.find().lean();

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
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch project overview",
    });
  }
});

router.get("/:id/tasks", async (req, res) => {
  try {
    const projectId = req.params.id;

    if (!projectId) {
      return res.status(400).json({ error: "Invalid projectId" });
    }

    const projectRecord = await ProjectModel.findOne({ id: projectId }).lean();

    if (!projectRecord) {
      return res.status(404).json({ error: "project not found" });
    }

    const taskRecords = await TaskModel.find({ projectId }).lean();
    const userRecords = await UserModel.find().lean();

    const tasks = taskRecords.map(toTaskDto);
    const users = userRecords.map(toUserDto);

    const usersById = new Map(users.map((u) => [u.id, u]));

    const projectTasks = toProjectTasksDto(tasks, usersById);

    return res.status(200).json({ data: projectTasks });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch project tasks",
    });
  }
});

router.get(
  "/:id/collaborators",
  async (
    req: Request<{ id: string }, {}, {}, ProjectCollaboratorsQuery>,
    res,
  ) => {
    try {
      const projectId = req.params.id;
      const { collaboratorsSort, page, limit } = req.query;

      if (!projectId) {
        return res.status(400).json({ error: "Invalid projectId" });
      }

      const parsedCollaboratorSort = parseCollaboratorSort(collaboratorsSort);

      const projectRecord = await ProjectModel.findOne({
        id: projectId,
      }).lean();

      if (!projectRecord) {
        return res.status(404).json({ error: "project not found" });
      }

      const project = toProjectDto(projectRecord);

      const userRecords = await UserModel.find({
        id: { $in: project.invitedUserIds },
      }).lean();

      const collaborators = userRecords.map(toUserDto);
      const sorted = sortedCollaborators(collaborators, parsedCollaboratorSort);

      let currentPage = Number(page);
      let currentLimit = Number(limit);

      if (isNaN(currentPage)) currentPage = 1;
      if (isNaN(currentLimit)) currentLimit = 9;

      const paginationItems = pagination(sorted, currentPage, currentLimit);

      return res.status(200).json({ data: paginationItems });
    } catch (error) {
      return res.status(500).json({
        error: "Failed to fetch project collaborators",
      });
    }
  },
);

router.get(
  "/:id/comments",
  async (req: Request<{ id: string }, {}, {}, ProjectCommentsQuery>, res) => {
    try {
      const projectId = req.params.id;
      const { commentsSort } = req.query;

      if (!projectId) {
        return res.status(400).json({ error: "Invalid projectId" });
      }

      const parsedCommentsSort = parseProjectCommentsSort(commentsSort);

      const projectRecord = await ProjectModel.findOne({
        id: projectId,
      }).lean();

      if (!projectRecord) {
        return res.status(404).json({ error: "project not found" });
      }

      const taskRecords = await TaskModel.find({ projectId }).lean();
      const tasks = taskRecords.map(toTaskDto);

      const taskIds = tasks.map((task) => task.id);

      const commentRecords = await CommentModel.find({
        taskId: { $in: taskIds },
      }).lean();

      const userRecords = await UserModel.find().lean();

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
    } catch (error) {
      return res.status(500).json({
        error: "Failed to fetch project comments",
      });
    }
  },
);

router.get(
  "/:id/workload",
  async (req: Request<{ id: string }, {}, {}, ProjectWorkloadQuery>, res) => {
    try {
      const projectId = req.params.id;

      if (!projectId) {
        return res.status(400).json({ error: "Invalid projectId" });
      }

      const parsedWorkloadSort = parseProjectWorkloadSort(
        req.query.workloadSort,
      );

      const projectRecord = await ProjectModel.findOne({
        id: projectId,
      }).lean();

      if (!projectRecord) {
        return res.status(404).json({ error: "project not found" });
      }

      const taskRecords = await TaskModel.find({ projectId }).lean();

      const tasks = taskRecords.map(toTaskDto);

      const collaboratorIds = new Set(
        tasks.flatMap((task) => task.collaboratorIds),
      );

      const userRecords = await UserModel.find({
        id: { $in: [...collaboratorIds] },
      }).lean();

      const users = userRecords.map(toUserDto);
      const usersById = new Map(users.map((user) => [user.id, user]));

      const workload = toProjectUserWorkloadDto(tasks, usersById);
      const sorted = sortedWorkload(workload, parsedWorkloadSort);

      let page = Number(req.query.page);
      let limit = Number(req.query.limit);

      if (isNaN(page)) page = 1;
      if (isNaN(limit)) limit = 9;

      const paginationItems = pagination(sorted, page, limit);

      return res.status(200).json({ data: paginationItems });
    } catch (error) {
      return res.status(500).json({
        error: "Failed to fetch project workload",
      });
    }
  },
);

// files

export default router;
