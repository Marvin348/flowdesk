import express from "express";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";
import {
  acceptWorkspaceInviteSchema,
  createWorkspaceInviteSchema,
} from "@/features/workspace-invites/validators/workspaceInvite.validators.js";
import { AppError } from "@/utils/AppError.js";
import { findUserInWorkspace } from "@/features/users/services/user.service.js";
import { createWorkspaceInvite } from "@/features/workspace-invites/services/workspaceInvite.service.js";
import { requireAuth } from "@/features/auth/middleware/requireAuth.js";
import { getWorkspaceInviteByToken } from "@/features/workspace-invites/services/getWorkspaceInviteByToken.service.js";
import { acceptWorkspaceInvite } from "@/features/workspace-invites/services/acceptWorkspaceInvite.service.js";
import { verificationTokenSchema } from "@/features/verification-tokens/validators/verifyEmailSchema.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const result = createWorkspaceInviteSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError("Invalid email", 400);
    }

    const email = result.data.email;

    const { userId, workspaceId, role } = getAuthContext(req);

    const user = await findUserInWorkspace({ userId, workspaceId });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const invite = await createWorkspaceInvite({
      email,
      userId,
      workspaceId,
      role,
    });

    return res.status(201).json({ invite });
  }),
);

router.get<{ token: string }>(
  "/:token",
  asyncHandler(async (req, res) => {
    const tokenParam = verificationTokenSchema.safeParse(req.params);

    if (!tokenParam.success) {
      throw new AppError("Invalid token", 400);
    }

    const invite = await getWorkspaceInviteByToken(tokenParam.data.token);

    return res.status(200).json({ invite });
  }),
);

router.post<{ token: string }>(
  "/:token/accept",
  asyncHandler(async (req, res) => {
    const tokenParam = verificationTokenSchema.safeParse(req.params);

    if (!tokenParam.success) {
      throw new AppError("Invalid token", 400);
    }

    const result = acceptWorkspaceInviteSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError("Invalid Input", 400);
    }

    await acceptWorkspaceInvite({
      token: tokenParam.data.token,
      name: result.data.name,
      password: result.data.password,
    });

    return res.status(201).json({ message: "Invite was successfully" });
  }),
);

export default router;
