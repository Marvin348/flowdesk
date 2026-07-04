import express from "express";
import type { Request } from "express";
import { UserRole } from "@shared/types/user.js";
import type {
  TeamActivity,
  TeamProgress,
  TeamSort,
} from "@shared/types/teamFilter/teamFilter.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { toUserDto } from "@/features/users/mappers/user.mapper.js";
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
import { getTeamMembers } from "@/features/users/services/getTeamMembers.service.js";
import { teamMembersQuerySchema } from "@/features/users/validators/teamMembersQuerySchema.validator.js";
import { userDetailsParamsSchema } from "@/features/users/validators/userDetailsParamsSchema.validator.js";
import { getUserDetails } from "@/features/users/services/getUserDetails.service.js";
import {
  updateUserRoleBodySchema,
  updateUserRoleParamsSchema,
} from "@/features/users/validators/updateUserRoleSchema.validator.js";
import { updateUserRole } from "@/features/users//services/updateUserRole.service.js";

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
    const result = teamMembersQuerySchema.safeParse(req.query);

    if (!result.success) {
      throw new AppError("Invalid query params", 400);
    }

    const query = result.data;

    const { workspaceId } = getAuthContext(req);

    const sortedTeamMembers = await getTeamMembers({
      query,
      workspaceId,
    });

    return res.status(200).json({
      data: sortedTeamMembers,
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

    const result = userDetailsParamsSchema.safeParse(req.params);

    if (!result.success) {
      throw new AppError("Invalid userId", 400);
    }

    const userDetails = await getUserDetails({
      workspaceId,
      userId: result.data.id,
    });

    return res.status(200).json({ data: userDetails });
  }),
);

router.patch(
  "/:id",
  asyncHandler(
    async (req: Request<{ id: string }, {}, { role: UserRole }>, res) => {
      const {
        userId: currentUserId,
        workspaceId,
        role: currentUserRole,
      } = getAuthContext(req);

      const paramsResult = updateUserRoleParamsSchema.safeParse(req.params);

      if (!paramsResult.success) {
        throw new AppError("Invalid userId", 400);
      }

      const bodyResult = updateUserRoleBodySchema.safeParse(req.body);

      if (!bodyResult.success) {
        throw new AppError("Invalid input", 400);
      }

      if (currentUserRole !== "admin") {
        throw new AppError("Only admins can change user roles", 403);
      }

      const updatedUser = await updateUserRole({
        workspaceId,
        targetUserId: paramsResult.data.id,
        role: bodyResult.data.role,
        currentUserId,
      });

      return res.status(200).json({
        data: updatedUser,
      });
    },
  ),
);

export default router;
