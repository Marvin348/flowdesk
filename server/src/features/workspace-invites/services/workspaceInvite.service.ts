import { AppError } from "@/utils/AppError.js";
import { UserRole } from "@shared/types/user.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { createRandomToken } from "@/utils/createRandomToken.js";
import { WorkspaceInviteModel } from "@/features/workspace-invites/models/workspaceInvite.model.js";
import { addDays } from "@/utils/date.js";
import { createActivity } from "@/features/activity/services/createActivity.service.js";
import { Types } from "mongoose";
import { hashToken } from "@/utils/hashToken.js";
import { sendWorkspaceInviteVerificationEmail } from "@/features/email/services/sendWorkspaceInviteVerificationEmail.service.js";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model.js";

type CreateWorkspaceInviteInput = {
  email: string;
  userId: string;
  workspaceId: Types.ObjectId;
  role: UserRole;
};

export const createWorkspaceInvite = async ({
  email,
  userId,
  workspaceId,
  role,
}: CreateWorkspaceInviteInput) => {
  if (role !== "admin") {
    throw new AppError("Only admins can create workspace-invites", 403);
  }

  const existingUser = await UserModel.exists({ email });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const existingInvites = await WorkspaceInviteModel.exists({
    email,
    workspaceId,
    usedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  });

  if (existingInvites) {
    throw new AppError("Invite already exists", 409);
  }

  const token = createRandomToken();
  const tokenHash = hashToken(token);

  const expiresAt = addDays(7);

  const newInvite = await WorkspaceInviteModel.create({
    email,
    workspaceId,
    tokenHash,
    role: "member",
    createdBy: userId,
    expiresAt,
  });

  const inviteUrl = `${process.env.CLIENT_URL}/invite/${token}`;

  const workspace = await WorkspaceModel.findOne({ _id: workspaceId });

  if (!workspace) {
    throw new AppError("Workspace not found", 404);
  }

  await sendWorkspaceInviteVerificationEmail({
    to: email,
    inviteUrl,
    workspaceName: workspace.name,
  });

  await createActivity({
    workspaceId,
    actorId: userId,
    type: "workspace_invite.created",
    entityType: "workspace_invite",
    entityId: newInvite._id.toString(),
    metadata: {
      invitedEmail: newInvite.email,
      invitedRole: newInvite.role,
    },
  });

  return {
    email: newInvite.email,
    expiresAt: newInvite.expiresAt,
  };
};
