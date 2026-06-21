import { AppError } from "@/utils/AppError.js";
import { UserRole } from "@shared/types/user.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { createRandomToken } from "@/utils/createRandomToken.js";
import { WorkspaceInviteModel } from "../models/workspaceInvite.model.js";
import { addDays } from "@/utils/date.js";
import { createActivity } from "@/features/activity/services/createActivity.service.js";

type CreateWorkspaceInviteInput = {
  email: string;
  userId: string;
  workspaceId: string;
  role: UserRole;
};

export const createWorkspaceInvite = async ({
  email,
  userId,
  workspaceId,
  role,
}: CreateWorkspaceInviteInput) => {
  if (role !== "admin") {
    throw new AppError("Not allowed", 403);
  }

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const existingInvites = await WorkspaceInviteModel.findOne({
    email,
    workspaceId,
    usedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  });

  if (existingInvites) {
    throw new AppError("Invite already exists", 409);
  }

  const token = createRandomToken();
  const expiresAt = addDays(7);

  const newInvite = await WorkspaceInviteModel.create({
    email,
    workspaceId,
    token,
    role: "member",
    createdBy: userId,
    expiresAt,
  });

  const inviteUrl = `${process.env.CLIENT_URL}/invite/${newInvite.token}`;

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
    inviteUrl,
    email: newInvite.email,
    expiresAt: newInvite.expiresAt,
  };
};
