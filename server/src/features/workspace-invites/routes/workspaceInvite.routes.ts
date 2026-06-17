import express from "express";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";
import { createWorkspaceInviteSchema } from "@/features/workspace-invites/validators/workspaceInvite.validators.js";
import { AppError } from "@/utils/AppError.js";
import { findUserInWorkspace } from "@/features/users/services/user.service.js";
import { createWorkspaceInvite } from "@/features/workspace-invites/services/workspaceInvite.service.js";

const router = express.Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const result = createWorkspaceInviteSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError("Invalid email", 400);
    }

    const email = result.data.email;

    const { userId, workspaceId } = getAuthContext(req);

    const user = await findUserInWorkspace({ userId, workspaceId });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const invite = await createWorkspaceInvite({
      email,
      userId,
      workspaceId,
      role: user.role,
    });

    return res.status(201).json({ invite });
  }),
);

export default router;
