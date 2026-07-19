import { AppError } from "@/utils/AppError";
import { UserModel } from "@/features/users/models/user.modal";
import { createVerificationToken } from "@/features/verification-tokens/services/createVerificationToken.service";
import { sendEmailChangeVerificationEmail } from "@/features/email/services/sendEmailChangeVerificationEmail.service";
import { Types } from "mongoose";

type ChangeEmailInput = {
  userId: string;
  workspaceId: Types.ObjectId;
  newEmail: string;
};

export const changeEmail = async ({
  userId,
  workspaceId,
  newEmail,
}: ChangeEmailInput) => {
  const user = await UserModel.findOne({ workspaceId, _id: userId });

  if (!user) {
    throw new AppError("Invalid User", 400);
  }

  if (user.email === process.env.DEMO_ACCOUNT_EMAIL) {
    throw new AppError("The demo account email cannot be changed.", 403);
  }

  if (!user.isEmailVerified) {
    throw new AppError("Email needs to be verifyt", 401);
  }

  if (user.email === newEmail) {
    throw new AppError("Email is already same", 409);
  }

  const existingEmail = await UserModel.findOne({ email: newEmail });

  if (existingEmail) {
    throw new AppError("Email already in use", 409);
  }

  const verificationToken = await createVerificationToken({
    userId: user._id,
    type: "email_change",
    newEmail,
  });

  const verificationUrl = `${process.env.CLIENT_URL}/confirm-email-change/${verificationToken}`;

  await sendEmailChangeVerificationEmail({
    to: newEmail,
    verificationUrl,
    newEmail,
  });
};
