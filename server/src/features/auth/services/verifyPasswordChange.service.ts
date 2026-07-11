import { UserModel } from "@/features/users/models/user.modal.js";
import { VerificationTokenModel } from "@/features/verification-tokens/models/verificationToken.model.js";
import { AppError } from "@/utils/AppError.js";
import { hashToken } from "@/utils/hashToken.js";

type VerifyPasswordChangeInput = {
  userId: string;
  workspaceId: string;
  token: string;
};

export const verifyPasswordChange = async ({
  userId,
  workspaceId,
  token,
}: VerifyPasswordChangeInput) => {
  const hashedToken = hashToken(token);

  const verificationToken = await VerificationTokenModel.findOne({
    tokenHash: hashedToken,
    type: "password_change",
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
    throw new AppError("Token does not belong to this user", 403);
  }

  if (!verificationToken.newPasswordHash) {
    throw new AppError("New password is missing", 400);
  }

  const user = await UserModel.findOne({ _id: userId, workspaceId });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.passwordHash = verificationToken.newPasswordHash;
  user.passwordChangedAt = now;

  verificationToken.usedAt = now;

  await user.save();
  await verificationToken.save();
};
