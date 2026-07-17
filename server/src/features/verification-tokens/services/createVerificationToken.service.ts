import { createRandomToken } from "@/utils/createRandomToken";
import { addDays } from "@/utils/date";
import { hashToken } from "@/utils/hashToken";
import { VerificationTokenModel } from "@/features/verification-tokens/models/verificationToken.model";
import { Types } from "mongoose";
import { VerificationTokenType } from "@/features/verification-tokens/types/verificationToken.document";
import { AppError } from "@/utils/AppError";

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

  const expiresAt = addDays(1);

  await VerificationTokenModel.deleteMany({
    userId,
    type: type,
  });

  await VerificationTokenModel.create({
    userId,
    tokenHash,
    type: type,
    expiresAt,
    ...(newEmail && { newEmail }),
    ...(newPasswordHash && { newPasswordHash }),
  });

  return token;
};
