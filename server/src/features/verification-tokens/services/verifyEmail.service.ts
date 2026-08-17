import { hashToken } from "@/utils/hashToken";
import { AppError } from "@/utils/AppError";
import { UserModel } from "@/features/users/models/user.modal";
import { consumeVerificationToken } from "@/features/verification-tokens/repository/verificationToken.repository";
import { deleteCurrentVerificationToken } from "@/features/verification-tokens/repository/currentVerificationToken.repository";


export const verifyEmail = async ({ token }: { token: string }) => {
  const hashedToken = hashToken(token);

  const verificationToken = await consumeVerificationToken({
    verificationToken: hashedToken,
    expectedType: "email_verification",
  });

  if (!verificationToken) {
    throw new AppError("Token not found", 400);
  }

  const user = await UserModel.findById(verificationToken.userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.isEmailVerified = true;
  user.emailVerifiedAt = new Date();

  await user.save();

  await deleteCurrentVerificationToken({
    userId: user._id.toString(),
    type: "email_verification",
  });
};
