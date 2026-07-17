import { AppError } from "@/utils/AppError";
import { Request } from "express";

export const getAuthContext = (req: Request) => {
  if (!req.user) {
    throw new AppError("Not authenticated", 401);
  }

  return {
    userId: req.user.id,
    workspaceId: req.user.workspaceId,
    role: req.user.role,
  };
};
