import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/features/auth/utils/tokens.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { AppError } from "@/utils/AppError.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const requireAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new AppError("Not authenticated", 401);
    }

    const payload = verifyAccessToken(token);

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
      workspaceId: user.workspaceId.toString(),
      role: user.role,
    };

    next();
  },
);
