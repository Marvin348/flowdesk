import { createRandomToken } from "@/utils/createRandomToken.js";
import { addDays } from "@/utils/date.js";
import { hashToken } from "@/utils/hashToken.js";
import { VerificationTokenModel } from "@/features/verification-tokens/models/verificationToken.model.js";
import { Types } from "mongoose";

export const createEmailVerificationToken = async (
  userId: Types.ObjectId,
): Promise<string> => {
  const token = createRandomToken();
  const tokenHash = hashToken(token);

  const expiresAt = addDays(1);

  await VerificationTokenModel.deleteMany({
    userId,
    type: "email_verification",
  });

  await VerificationTokenModel.create({
    userId,
    tokenHash,
    type: "email_verification",
    expiresAt,
  });

  return token;
};
