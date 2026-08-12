import type { LoginInput } from "@/features/auth/validators/auth.validators";

export type AuthLoginInput = {
  input: LoginInput;
  sessionMetadata: {
    userAgent?: string;
    userIp?: string;
  };
};
