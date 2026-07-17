import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/features/auth/utils/tokens";
import { UserModel } from "@/features/users/models/user.modal";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";

export const requireAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new AppError("Not authenticated", 401);
    }

    let payload;

    try {
      payload = verifyAccessToken(token);
    } catch {
      throw new AppError("Not authenticated", 401);
    }

    if (typeof payload === "string" || !payload.sub) {
      throw new AppError("Not authenticated", 401);
    }

    const userId = payload.sub;

    const user = await UserModel.findById(userId).lean();

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
