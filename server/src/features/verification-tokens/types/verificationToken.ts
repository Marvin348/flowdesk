import type { VerificationTokenType } from "./verificationToken.document";

export type VerificationTokenData = {
  userId: string;
  type: VerificationTokenType;
  newEmail?: string;
  newPasswordHash?: string;
};

export type SaveVerificationTokenInput = {
  verificationToken: string;
  verificationData: VerificationTokenData;
};

export type SaveCurrentVerificationTokenInput = {
  userId: string;
  type: VerificationTokenType;
  verificationToken: string;
};

export type FindCurrentVerificationTokenInput = {
  userId: string;
  type: VerificationTokenType;
};

export type DeleteCurrentVerificationToken = {
  userId: string;
  type: VerificationTokenType;
};

export type ConsumeVerificationTokenInput = {
  verificationToken: string;
  expectedType: VerificationTokenType;
  expectedUserId?: string;
};

export type ReplaceCurrentVerificationTokenInput = {
  verificationToken: string;
  userId: string;
  type: VerificationTokenType;
  verificationData: VerificationTokenData;
};
