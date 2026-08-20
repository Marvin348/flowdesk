import type {
  GetRateLimitKeyInput,
} from "@/features/rate-limits/types/rateLimits";

export const getRateLimitKey = ({
  type,
  identifierType,
  identifier,
}: GetRateLimitKeyInput) => {
  return `rate-limit:${type}:${identifierType}:${identifier}`;
};
