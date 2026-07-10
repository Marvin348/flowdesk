import { PasswordInput } from "@/features/auth/validators/auth.validators.js";
import { AppError } from "@/utils/AppError.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { comparePassword } from "../utils/password.js";
import { hashPassword } from "../utils/password.js";
import { createVerificationToken } from "@/features/verification-tokens/services/createVerificationToken.service.js";
import mongoose from "mongoose";
import { sendPasswordChangeVerificationEmail } from "@/features/email/services/sendPasswordChangeVerificationEmail.service.js";

type RequestPasswordChangeInput = {
  workspaceId: string;
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
