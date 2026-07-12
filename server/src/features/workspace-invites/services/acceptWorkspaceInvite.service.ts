import { AppError } from "@/utils/AppError.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { WorkspaceInviteModel } from "@/features/workspace-invites/models/workspaceInvite.model.js";
import { hashPassword } from "@/features/auth/utils/password.js";
import { toUserDto } from "@/features/users/mappers/user.mapper.js";
import { createActivity } from "@/features/activity/services/createActivity.service.js";

type AcceptWorkspaceInviteParams = {
  token: string;
  name: string;
  password: string;
};

export const acceptWorkspaceInvite = async ({
  token,
  name,
  password,
}: AcceptWorkspaceInviteParams) => {
  const invite = await WorkspaceInviteModel.findOne({ token });

  if (!invite) {
    throw new AppError("Token not found", 404);
  }

  if (invite.usedAt) {
    throw new AppError("Token was already used", 409);
  }

  const now = new Date();

  if (invite.expiresAt <= now) {
    throw new AppError("Invite has expired", 410);
  }

  const user = await UserModel.findOne({ email: invite.email });

  if (user) {
    throw new AppError("Email already used", 409);
  }

  const passwordHash = await hashPassword(password);

  const newUser = await UserModel.create({
    name,
    passwordHash,
    email: invite.email,
    workspaceId: invite.workspaceId,
    role: invite.role,
  });

  invite.usedAt = new Date();
  await invite.save();

  await createActivity({
    workspaceId: invite.workspaceId,
    actorId: newUser._id.toString(),
    type: "workspace_invite.accepted",
    entityType: "workspace_invite",
    entityId: invite._id.toString(),
    metadata: {
      invitedEmail: invite.email,
      joinedUserName: newUser.name,
      role: newUser.role,
    },
  });

  return toUserDto(newUser);
};
