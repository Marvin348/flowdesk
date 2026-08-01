import express from "express";
import type { Request } from "express";
import { UserRole } from "@shared/types/user";
import type {
  TeamActivity,
  TeamProgress,
  TeamSort,
} from "@shared/types/teamFilter/teamFilter";
import { UserModel } from "@/features/users/models/user.modal";
import {
  toUserDto,
  toUserSecurityOverviewDto,
} from "@/features/users/mappers/user.mapper";
import {
  updateCurrentUserSchema,
  appearanceSettingsSchema,
  changeEmailSchema,
} from "@/features/users/validators/user.validator";
import {
  updateCurrentUser,
  updateAppearanceSettings,
} from "@/features/users/services/user.service";
import { getAuthContext } from "@/features/auth/utils/getAuthContext";
import { asyncHandler } from "@/utils/asyncHandler";
import { AppError } from "@/utils/AppError";
import { getTeamMembers } from "@/features/users/services/team/getTeamMembers.service";
import { teamMembersQuerySchema } from "@/features/users/validators/teamMembersQuerySchema.validator";
import { userDetailsParamsSchema } from "@/features/users/validators/userDetailsParamsSchema.validator";
import { getUserDetails } from "@/features/users/services/team/getUserDetails.service";
import {
  updateUserRoleBodySchema,
  updateUserRoleParamsSchema,
} from "@/features/users/validators/updateUserRoleSchema.validator";
import { updateUserRole } from "@/features/users/services/team/updateUserRole.service";
import { changeEmail } from "@/features/users/services/email/changeEmail.service";
import { verificationTokenSchema } from "@/features/verification-tokens/validators/verifyEmailSchema";
import { verifyChangeEmail } from "@/features/users/services/email/verifyChangeEmail.service";
import { getMySecurityOverview } from "../services/security/getMySecurityOverview.service";
import { changeUserNotificationSettings } from "../services/settings/changeUserNotificationSettings.service";
import { userNotificationSettingsSchema } from "../validators/changeUserNotificationSettingsSchema";

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

router.get(
  "/me/security",
  asyncHandler(async (req, res) => {
    const { userId, workspaceId } = getAuthContext(req);

    const securityOverview = await getMySecurityOverview({
      userId,
      workspaceId,
    });

    return res.status(200).json({ user: securityOverview });
  }),
);

router.patch(
  "/me/change-email",
  asyncHandler(async (req, res) => {
    const email = changeEmailSchema.safeParse(req.body);

    if (!email.success) {
      throw new AppError("Invalid email", 400);
    }

    const { userId, workspaceId } = getAuthContext(req);

    await changeEmail({ userId, workspaceId, newEmail: email.data.email });

    return res
      .status(200)
      .json({ message: "Email verification has been send" });
  }),
);

router.post(
  "/me/change-email/verify",
  asyncHandler(async (req, res) => {
    const result = verificationTokenSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError("Invalid token", 400);
    }

    const { userId, workspaceId } = getAuthContext(req);

    await verifyChangeEmail({ workspaceId, token: result.data.token, userId });

    return res.status(200).json({ message: "Email successfully changed" });
  }),
);

router.patch(
  "/me/appearance-settings",
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

router.patch(
  "/me/notification-settings",
  asyncHandler(async (req, res) => {
    const result = userNotificationSettingsSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError("Invalid notification settings", 400);
    }

    const { userId, workspaceId } = getAuthContext(req);

    await changeUserNotificationSettings({
      workspaceId,
      userId,
      input: result.data,
    });

    return res.status(200).json({message: "Updated Notification settings successful"})
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
