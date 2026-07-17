import { VerificationTokenModel } from "@/features/verification-tokens/models/verificationToken.model";
import { AppError } from "@/utils/AppError";
import { hashToken } from "@/utils/hashToken";
import { UserModel } from "@/features/users/models/user.modal";
import { Types } from "mongoose";

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

  const verificationToken = await VerificationTokenModel.findOne({
    tokenHash: hashedToken,
    type: "email_change",
  });

  if (!verificationToken) {
    throw new AppError("Token not found", 400);
  }

  if (verificationToken.usedAt) {
    throw new AppError("Token was already used", 409);
  }

  const now = new Date();

  if (verificationToken.expiresAt <= now) {
    throw new AppError("Token has expired", 410);
  }

  if (!verificationToken.userId.equals(userId)) {
    throw new AppError("UserId is wrong", 403);
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
  });

  if (existingEmail) {
    throw new AppError("Email already in use", 409);
  }

  user.email = verificationToken.newEmail;
  verificationToken.usedAt = now;

  await user.save();
  await verificationToken.save();
};
