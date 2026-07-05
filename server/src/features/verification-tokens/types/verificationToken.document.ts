import { Types } from "mongoose";

export type VerificationTokenDocument = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  tokenHash: string;
  type: VerificationTokenType;
  newEmail?: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type VerificationTokenType = (typeof VERIFICATION_TOKEN_TYPE)[number];
export const VERIFICATION_TOKEN_TYPE = [
  "email_verification",
  "email_change",
] as const;
