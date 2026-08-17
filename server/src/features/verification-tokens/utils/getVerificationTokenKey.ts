import { VerificationTokenType } from "../types/verificationToken.document";

type GetCurrentVerificationKeyInput = {
  type: VerificationTokenType;
  userId: string;
};

export const getVerificationTokenKey = (verificationToken: string) => {
  return `verification:${verificationToken}`;
};

export const getCurrentVerificationKey = ({
  type,
  userId,
}: GetCurrentVerificationKeyInput) => {
  return `verification:user:${userId}:${type}`;
};
