import {
  getRateLimitTtl,
  consumeRateLimitCounter,
} from "@/features/rate-limits/repository/rateLimit.repository";
import { ConsumeRateLimitInput } from "@/features/rate-limits/types/rateLimits";

export const consumeRateLimit = async ({
  type,
  identifier,
  identifierType,
  maxRequests,
  ttlSeconds,
}: ConsumeRateLimitInput) => {
  const count = await consumeRateLimitCounter({
    type,
    identifier,
    identifierType,
    ttlSeconds,
  });

  let retryAfterSeconds: number | undefined = undefined;

  if (count > maxRequests) {
    retryAfterSeconds = await getRateLimitTtl({
      type,
      identifier,
      identifierType,
    });
  }

  return {
    allowed: count <= maxRequests,
    retryAfterSeconds,
  };
};
