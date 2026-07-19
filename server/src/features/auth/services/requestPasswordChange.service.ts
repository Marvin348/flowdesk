import { PasswordInput } from "@/features/auth/validators/auth.validators";
import { AppError } from "@/utils/AppError";
import { UserModel } from "@/features/users/models/user.modal";
import { comparePassword } from "../utils/password";
import { hashPassword } from "../utils/password";
import { createVerificationToken } from "@/features/verification-tokens/services/createVerificationToken.service";
import mongoose, { Types } from "mongoose";
import { sendPasswordChangeVerificationEmail } from "@/features/email/services/sendPasswordChangeVerificationEmail.service";

type RequestPasswordChangeInput = {
  workspaceId: Types.ObjectId;
  userId: string;
  input: PasswordInput;
};

export const requestPasswordChange = async ({
  workspaceId,
  userId,
  input,
}: RequestPasswordChangeInput) => {
  const userIdObject = new mongoose.Types.ObjectId(userId);

  const { currentPassword, newPassword } = input;

  const user = await UserModel.findOne({ _id: userIdObject, workspaceId });

  if (!user) {
    throw new AppError("Invalid user", 404);
  }

  if (user.email === process.env.DEMO_ACCOUNT_EMAIL) {
    throw new AppError("The demo account password cannot be changed.", 403);
  }

  const isPasswordValid = await comparePassword(
    currentPassword,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new AppError("Current password is invalid", 400);
  }

  const isSameAsOldPassword = await comparePassword(
    newPassword,
    user.passwordHash,
  );

  if (isSameAsOldPassword) {
    throw new AppError(
      "New password must be different from current password",
      409,
    );
  }

  const hashedNewPassword = await hashPassword(newPassword);

  const verificationToken = await createVerificationToken({
    userId: userIdObject,
    type: "password_change",
    newPasswordHash: hashedNewPassword,
  });

  const verificationUrl = `${process.env.CLIENT_URL}/confirm-password-change/${verificationToken}`;

  await sendPasswordChangeVerificationEmail({
    to: user.email,
    verificationUrl,
  });
};
