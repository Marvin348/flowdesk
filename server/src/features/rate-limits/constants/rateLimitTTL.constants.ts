import type {
  RateLimitTypes,
  IdentifierType,
} from "@/features/rate-limits/types/rateLimits";

type RateLimitRule = {
  identifierType: IdentifierType;
  maxRequests: number;
  ttlSeconds: number;
};

export const RATE_LIMIT_CONFIG = {
  login: [
    {
      identifierType: "ip",
      maxRequests: 100,
      ttlSeconds: 2 * 60,
    },
    {
      identifierType: "email",
      maxRequests: 10,
      ttlSeconds: 15 * 60,
    },
  ],

  register: [
    {
      identifierType: "ip",
      maxRequests: 100,
      ttlSeconds: 2 * 60,
    },
    {
      identifierType: "email",
      maxRequests: 3,
      ttlSeconds: 15 * 60,
    },
  ],

  resend_verification_email: [
    {
      identifierType: "ip",
      maxRequests: 50,
      ttlSeconds: 2 * 60,
    },
    {
      identifierType: "email",
      maxRequests: 3,
      ttlSeconds: 15 * 60,
    },
  ],

  change_password: [
    {
      identifierType: "user",
      maxRequests: 5,
      ttlSeconds: 15 * 60,
    },
  ],
} satisfies Record<RateLimitTypes, readonly RateLimitRule[]>;
