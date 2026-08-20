export type RateLimitTypes =
  | "login"
  | "register"
  | "change_password"
  | "resend_verification_email";

export type IdentifierType = "ip" | "email" | "user";

export type RateLimitIdentifierInput = {
  type: RateLimitTypes;
  identifierType: IdentifierType;
  identifier: string;
};

export type ConsumeRateLimitInput = RateLimitIdentifierInput & {
  maxRequests: number;
  ttlSeconds: number;
};

export type ConsumeRateLimitCounterInput = RateLimitIdentifierInput & {
  ttlSeconds: number;
};

export type GetRateLimitTtlInput = RateLimitIdentifierInput;
export type GetRateLimitKeyInput = RateLimitIdentifierInput;