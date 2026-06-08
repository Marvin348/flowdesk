import { Request } from "express";

export const getAuthContext = (req: Request) => {
  if (!req.user) {
    throw new Error("Not authenticated");
  }

  return {
    userId: req.user.id,
    workspaceId: req.user.workspaceId,
    role: req.user.role,
  };
};
