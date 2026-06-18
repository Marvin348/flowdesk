import { WorkspaceInviteModel } from "@/features/workspace-invites/models/workspaceInvite.model.js";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model.js";
import { AppError } from "@/utils/AppError.js";

export const getWorkspaceInviteByToken = async (token: string) => {
  const workspaceInvite = await WorkspaceInviteModel.findOne({ token }).lean();

  if (!workspaceInvite) {
    throw new AppError("Token not found", 404);
  }

  if (workspaceInvite.usedAt) {
    throw new AppError("Token was already used", 409);
  }

  const now = new Date();

  if (workspaceInvite.expiresAt <= now) {
    throw new AppError("Invite has expired", 410);
  }

  const workspace = await WorkspaceModel.findById(workspaceInvite.workspaceId);

  if (!workspace) {
    throw new AppError("Workspace not found", 404);
  }

  return {
    email: workspaceInvite.email,
    workspaceName: workspace.name,
    expiresAt: workspaceInvite.expiresAt,
  };
};
