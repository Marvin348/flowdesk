import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/features/auth/utils/tokens.js";
import { UserModel } from "@/features/users/models/user.modal.js";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const payload = verifyAccessToken(token);

    if (typeof payload === "string" || !payload.sub) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userId = payload.sub;

    const user = await UserModel.findById(userId).lean();

    if (!user) {
      return res.status(401).json({ message: "Invalid User" });
    }

    if (!user.workspaceId) {
      return res.status(401).json({ message: "WorkspaceId not found" });
    }

    req.user = {
      id: userId,
      workspaceId: user.workspaceId.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authenticated" });
  }
};
