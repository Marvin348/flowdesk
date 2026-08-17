import { redisClient } from "@/shared/config/redis";
import { getVerificationTokenKey } from "@/features/verification-tokens/utils/getVerificationTokenKey";
import type { ConsumeVerificationTokenInput } from "@/features/verification-tokens/types/verificationToken";

export const consumeVerificationToken = async ({
  verificationToken,
  expectedType,
  expectedUserId,
}: ConsumeVerificationTokenInput) => {
  const key = getVerificationTokenKey(verificationToken);

  const value = await redisClient.eval(
    `
    local value = redis.call("GET", KEYS[1])

    if not value then
      return nil
    end

    local data = cjson.decode(value)

    if data.type ~= ARGV[1] then
      return nil
    end

    if ARGV[2] ~= "" and data.userId ~= ARGV[2] then
      return nil
    end

    redis.call("DEL", KEYS[1])

    return value
  `,
    {
      keys: [key],
      arguments: [expectedType, expectedUserId ?? ""],
    },
  );

  if (!value) {
    return null;
  }

  return JSON.parse(value as string);
};
