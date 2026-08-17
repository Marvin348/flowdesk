import { AppError } from "@/utils/AppError";
import { hashToken } from "@/utils/hashToken";
import { UserModel } from "@/features/users/models/user.modal";
import { Types } from "mongoose";
import { notificationQueue } from "@/queues/notificationQueue";
import { consumeVerificationToken } from "@/features/verification-tokens/repository/verificationToken.repository";
import { deleteCurrentVerificationToken } from "@/features/verification-tokens/repository/currentVerificationToken.repository";

type VerifyChangeEmailInput = {
  workspaceId: Types.ObjectId;
  token: string;
  userId: string;
};

export const verifyChangeEmail = async ({
  workspaceId,
  token,
  userId,
}: VerifyChangeEmailInput) => {
  const hashedToken = hashToken(token);

  const verificationToken = await consumeVerificationToken({
    verificationToken: hashedToken,
    expectedType: "email_change",
    expectedUserId: userId.toString(),
  });

  if (!verificationToken) {
    throw new AppError("Token not found", 400);
  }

  if (!verificationToken.newEmail) {
    throw new AppError("New email does not exist", 400);
  }

  const user = await UserModel.findOne({ _id: userId, workspaceId });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const existingEmail = await UserModel.findOne({
    email: verificationToken.newEmail,
    _id: { $ne: userId },
  }).select("_id");

  if (existingEmail) {
    throw new AppError("Email already in use", 409);
  }

  user.email = verificationToken.newEmail;
  user.emailVerifiedAt = new Date();

  await user.save();

  await deleteCurrentVerificationToken({
    userId: userId.toString(),
    type: "email_change",
  });

  await notificationQueue.add("user-email.changed", {
    workspaceId: workspaceId.toString(),
    recipientId: userId,
  });
};
