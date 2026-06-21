import express from "express";
import { toUsersPerformanceDto } from "@/features/users/mappers/users-performance.js";
import { pagination } from "@/shared/utils/pagination.js";
import type { Request } from "express";
import { toUserDetailsDto } from "@/features/users/mappers/user-details.mapper.js";
import { UserRole } from "@shared/types/user.js";
import type {
  TeamActivity,
  TeamProgress,
  TeamSort,
} from "@shared/types/teamFilter/teamFilter.js";
import { parseTeamFilter } from "@/shared/parsers/user-query-parsers.js";
import { getFilteredTeamMembers } from "@/features/users/utils/getFilteredTeamMembers.js";
import { sortTeamMembers } from "@/features/users/utils/sortTeamMembers.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { toUserDto } from "@/features/users/mappers/user.mapper.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { toProjectDto } from "@/features/projects/mappers/project.mapper.js";
import { buildUserQuery } from "@/features/users/queries/buildUserQuery.js";
import { PAGE_LIMITS } from "@shared/constants/pagination.js";
import { parsePagination } from "@/shared/parsers/parsePagination.js";
import {
  updateCurrentUserSchema,
  appearanceSettingsSchema,
} from "@/features/users/validators/user.validator.js";
import {
  updateCurrentUser,
  updateAppearanceSettings,
} from "@/features/users/services/user.service.js";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { AppError } from "@/utils/AppError.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { workspaceId } = getAuthContext(req);

    const users = await UserModel.find({ workspaceId }).lean();

    return res.json({ data: users.map(toUserDto) });
  }),
);

export type TeamMembersQuery = {
  search?: string;
  page?: string;
  limit?: string;
  role?: UserRole;
  sort?: TeamSort;
  progress?: TeamProgress;
  activity?: TeamActivity;
};

router.get(
  "/team",
  asyncHandler(async (req: Request<{}, {}, {}, TeamMembersQuery>, res) => {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const parsedTeamFilter = parseTeamFilter(req.query);

    const { workspaceId } = getAuthContext(req);

    const userQuery = buildUserQuery({
      search,
      role: parsedTeamFilter.role,
      workspaceId,
    });

    const userRecords = await UserModel.find(userQuery).lean();
    const taskRecords = await TaskModel.find({ workspaceId }).lean();

    const tasks = taskRecords.map(toTaskDto);
    const users = userRecords.map(toUserDto);

    const teamMembers = toUsersPerformanceDto(users, tasks);

    const filteredTeamMembers = getFilteredTeamMembers(
      teamMembers,
      parsedTeamFilter,
    );

    const sortedTeamMembers = sortTeamMembers(
      filteredTeamMembers,
      parsedTeamFilter.sort,
    );

    const { page, limit } = parsePagination({
      page: req.query.page,
      limit: req.query.limit,
      defaultLimit: PAGE_LIMITS.attachments,
    });

    const paginationItems = pagination(sortedTeamMembers, page, limit);

    return res.status(200).json({
      data: paginationItems,
    });
  }),
);

router.patch(
  "/me",
  asyncHandler(async (req, res) => {
    const result = updateCurrentUserSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError("Invalid profile data", 400);
    }

    const input = result.data;

    const { userId, workspaceId } = getAuthContext(req);

    const updatedUser = await updateCurrentUser({ input, userId, workspaceId });

    return res.status(201).json({ user: updatedUser });
  }),
);

router.patch(
  "/appearance",
  asyncHandler(async (req, res) => {
    const result = appearanceSettingsSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError("Invalid appearance setting", 400);
    }

    const input = result.data;

    const { userId, workspaceId } = getAuthContext(req);

    const updatedUserSettings = await updateAppearanceSettings({
      input,
      userId,
      workspaceId,
    });

    return res.status(201).json({ user: updatedUserSettings });
  }),
);

router.get(
  "/:id/details",
  asyncHandler(async (req, res) => {
    const { workspaceId } = getAuthContext(req);
    const targetUserId = req.params.id;

    if (!targetUserId) {
      throw new AppError("Invalid userId", 404);
    }

    const userRecord = await UserModel.findOne({
      _id: targetUserId,
      workspaceId,
    }).lean();

    if (!userRecord) {
      throw new AppError("User not found", 404);
    }

    const projectRecords = await ProjectModel.find({ workspaceId }).lean();
    const taskRecords = await TaskModel.find({ workspaceId }).lean();

    const user = toUserDto(userRecord);
    const projects = projectRecords.map(toProjectDto);
    const tasks = taskRecords.map(toTaskDto);

    const userDetails = toUserDetailsDto(user, projects, tasks);

    return res.status(200).json({ data: userDetails });
  }),
);

router.patch(
  "/:id",
  asyncHandler(
    async (req: Request<{ id?: string }, {}, { role?: UserRole }>, res) => {
      const { userId, workspaceId } = getAuthContext(req);
      const targetUserId = req.params.id;

      if (!targetUserId) {
        throw new AppError("Invalid userId", 404);
      }

      const currentUser = await UserModel.findOne({
        _id: userId,
        workspaceId,
      }).lean();

      if (!currentUser || currentUser.role !== "admin") {
        throw new AppError("Only admins can change user roles", 403);
      }

      const { role } = req.body;

      const isValidRole =
        role === "admin" || role === "member" || role === "manager";

      if (!isValidRole) {
        throw new AppError("Invalid role", 400);
      }

      const user = await UserModel.findOne({
        _id: targetUserId,
        workspaceId,
      }).lean();

      if (!user) {
        throw new AppError("User not found", 404);
      }

      if (user.role === role) {
        throw new AppError("User already has this role", 400);
      }

      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: targetUserId, workspaceId },
        { role },
        { returnDocument: "after" },
      ).lean();

      if (!updatedUser) {
        throw new AppError("User not found", 404);
      }

      return res.status(200).json({
        data: toUserDto(updatedUser),
      });
    },
  ),
);

export default router;
