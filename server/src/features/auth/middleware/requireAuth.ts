import type { Request, Response, NextFunction } from "express";
import { UserModel } from "@/features/users/models/user.modal";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { findSession } from "@/features/sessions/repository/session.repository";

export const requireAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
      throw new AppError("Not authenticated", 401);
    }

    const session = await findSession(sessionId);

    if (!session) {
      throw new AppError("Session expired or invalid", 401);
    }

    const userId = session.userId;

    const user = await UserModel.findById(userId)
      .select("_id workspaceId role")
      .lean();

    if (!user) {
      throw new AppError("Invalid User", 401);
    }

    if (!user.workspaceId) {
      throw new AppError("WorkspaceId not found", 401);
    }

    req.user = {
      id: userId,
      workspaceId: user.workspaceId,
      role: user.role,
    };

    next();
  },
);
