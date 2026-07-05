import { createRandomToken } from "@/utils/createRandomToken.js";
import { addDays } from "@/utils/date.js";
import { hashToken } from "@/utils/hashToken.js";
import { VerificationTokenModel } from "@/features/verification-tokens/models/verificationToken.model.js";
import { Types } from "mongoose";
import { VerificationTokenType } from "@/features/verification-tokens/types/verificationToken.document.js";
import { AppError } from "@/utils/AppError.js";

type CreateVerificationTokenInput = {
  userId: Types.ObjectId;
  type: VerificationTokenType;
  newEmail?: string;
};

export const createVerificationToken = async ({
  userId,
  type,
  newEmail,
}: CreateVerificationTokenInput): Promise<string> => {
  if (type === "email_change" && !newEmail) {
    throw new AppError("New email is required for email change token", 400);
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
  });

  return token;
};
