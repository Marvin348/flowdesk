import { UserModel } from "@/features/users/models/user.modal";
import { AppError } from "@/utils/AppError";
import { hashToken } from "@/utils/hashToken";
import { Types } from "mongoose";
import { notificationQueue } from "@/queues/notificationQueue";
import { consumeVerificationToken } from "@/features/verification-tokens/repository/verificationToken.repository";
import { deleteCurrentVerificationToken } from "@/features/verification-tokens/repository/currentVerificationToken.repository";

type VerifyPasswordChangeInput = {
  userId: string;
  workspaceId: Types.ObjectId;
  token: string;
};

export const verifyPasswordChange = async ({
  userId,
  workspaceId,
  token,
}: VerifyPasswordChangeInput) => {
  const hashedToken = hashToken(token);

  const verificationToken = await consumeVerificationToken({
    verificationToken: hashedToken,
    expectedType: "password_change",
    expectedUserId: userId.toString(),
  });

  if (!verificationToken) {
    throw new AppError("Token not found", 400);
  }

  if (!verificationToken.newPasswordHash) {
    throw new AppError("New password is missing", 400);
  }

  const user = await UserModel.findOne({
    _id: userId,
    workspaceId,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.passwordHash = verificationToken.newPasswordHash;
  user.passwordChangedAt = new Date();

  await user.save();

  await deleteCurrentVerificationToken({
    userId: userId.toString(),
    type: "password_change",
  });

  await notificationQueue.add("user-password.changed", {
    workspaceId: workspaceId.toString(),
    recipientId: userId,
  });
};
