import { createRandomToken } from "@/utils/createRandomToken";
import { hashToken } from "@/utils/hashToken";
import { Types } from "mongoose";
import { VerificationTokenType } from "@/features/verification-tokens/types/verificationToken.document";
import { AppError } from "@/utils/AppError";
import { replaceCurrentVerificationToken } from "@/features/verification-tokens/repository/currentVerificationToken.repository";

type CreateVerificationTokenInput = {
  userId: Types.ObjectId;
  type: VerificationTokenType;
  newEmail?: string;
  newPasswordHash?: string;
};

export const createVerificationToken = async ({
  userId,
  type,
  newEmail,
  newPasswordHash,
}: CreateVerificationTokenInput): Promise<string> => {
  if (type === "email_change" && !newEmail) {
    throw new AppError("New email is required for email change token", 400);
  }

  if (type === "password_change" && !newPasswordHash) {
    throw new AppError("New password hash is required", 400);
  }

  const token = createRandomToken();
  const tokenHash = hashToken(token);

  await replaceCurrentVerificationToken({
    verificationToken: tokenHash,
    userId: userId.toString(),
    type,
    verificationData: {
      userId: userId.toString(),
      type: type,
      ...(newEmail && { newEmail }),
      ...(newPasswordHash && { newPasswordHash }),
    },
  });

  return token;
};
