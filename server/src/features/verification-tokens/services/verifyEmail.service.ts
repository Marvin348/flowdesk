import { hashToken } from "@/utils/hashToken.js";
import { VerificationTokenModel } from "@/features/verification-tokens/models/verificationToken.model.js";
import { AppError } from "@/utils/AppError.js";
import { UserModel } from "@/features/users/models/user.modal.js";

export const verifyEmail = async ({ token }: { token: string }) => {
  const hashedToken = hashToken(token);

  const verificationToken = await VerificationTokenModel.findOne({
    tokenHash: hashedToken,
    type: "email_verification",
  });

  if (!verificationToken) {
    throw new AppError("Token not found", 400);
  }

  if (verificationToken.usedAt) {
    throw new AppError("Token was already used", 400);
  }

  const now = new Date();

  if (verificationToken.expiresAt <= now) {
    throw new AppError("Token has expired", 400);
  }

  const user = await UserModel.findById(verificationToken.userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.isEmailVerified = true;
  user.emailVerifiedAt = now;

  verificationToken.usedAt = now;
  
  await user.save();
  await verificationToken.save();
};
