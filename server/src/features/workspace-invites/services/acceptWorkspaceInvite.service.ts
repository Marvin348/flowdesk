import { AppError } from "@/utils/AppError";
import { UserModel } from "@/features/users/models/user.modal";
import { WorkspaceInviteModel } from "@/features/workspace-invites/models/workspaceInvite.model";
import { hashPassword } from "@/features/auth/utils/password";
import { createActivity } from "@/features/activity/services/createActivity.service";
import { hashToken } from "@/utils/hashToken";
import mongoose from "mongoose";

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
  const tokenHash = hashToken(token);
  const passwordHash = await hashPassword(password);
  const now = new Date();

  const activityData = await mongoose.connection.transaction(
    async (session) => {
      const invite = await WorkspaceInviteModel.findOne({ tokenHash }).session(
        session,
      );

      if (!invite) {
        throw new AppError("Token not found", 404);
      }

      if (invite.usedAt) {
        throw new AppError("Token was already used", 409);
      }

      if (invite.expiresAt <= now) {
        throw new AppError("Invite has expired", 410);
      }

      const user = await UserModel.findOne({ email: invite.email }).session(
        session,
      );

      if (user) {
        throw new AppError("Email already used", 409);
      }

      const inviteResult = await WorkspaceInviteModel.updateOne(
        {
          _id: invite._id,
          usedAt: null,
        },
        {
          $set: {
            usedAt: now,
          },
        },
        { session },
      );

      if (inviteResult.modifiedCount === 0) {
        throw new AppError("Token was already used", 409);
      }

      const [newUser] = await UserModel.create(
        [
          {
            name,
            passwordHash,
            email: invite.email,
            isEmailVerified: true,
            workspaceId: invite.workspaceId,
            role: invite.role,
          },
        ],
        { session },
      );

      return {
        workspaceId: invite.workspaceId,
        actorId: newUser._id.toString(),
        entityId: invite._id.toString(),
        invitedEmail: invite.email,
        joinedUserName: newUser.name,
        role: newUser.role,
      };
    },
  );

  await createActivity({
    workspaceId: activityData.workspaceId,
    actorId: activityData.actorId,
    type: "workspace_invite.accepted",
    entityType: "workspace_invite",
    entityId: activityData.entityId,
    metadata: {
      invitedEmail: activityData.invitedEmail,
      joinedUserName: activityData.joinedUserName,
      role: activityData.role,
    },
  });
};
