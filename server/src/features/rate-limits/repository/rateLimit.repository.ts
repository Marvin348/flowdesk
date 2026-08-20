import { redisClient } from "@/shared/config/redis";
import {
  ConsumeRateLimitCounterInput,
  GetRateLimitTtlInput,
} from "@/features/rate-limits/types/rateLimits";
import { getRateLimitKey } from "@/features/rate-limits/utils/getRateLimitsKey";

export const consumeRateLimitCounter = async ({
  type,
  identifierType,
  identifier,
  ttlSeconds,
}: ConsumeRateLimitCounterInput): Promise<number> => {
  const key = getRateLimitKey({ type, identifier, identifierType });

  const result = await redisClient.eval(
    `
  local count = redis.call("INCR", KEYS[1])

  if count == 1 then
    redis.call("EXPIRE", KEYS[1], ARGV[1])
  end

  return count
  `,
    {
      keys: [key],
      arguments: [String(ttlSeconds)],
    },
  );

  return Number(result);
};

export const getRateLimitTtl = async ({
  type,
  identifier,
  identifierType,
}: GetRateLimitTtlInput) => {
  return redisClient.ttl(getRateLimitKey({ type, identifier, identifierType }));
};
