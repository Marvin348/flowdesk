import { DeleteCurrentVerificationToken } from "@/features/verification-tokens/types/verificationToken";
import { redisClient } from "@/shared/config/redis";
import { getCurrentVerificationKey } from "@/features/verification-tokens/utils/getVerificationTokenKey";
import { ReplaceCurrentVerificationTokenInput } from "@/features/verification-tokens/types/verificationToken";
import { getVerificationTokenKey } from "@/features/verification-tokens/utils/getVerificationTokenKey";
import { VERIFICATION_TOKEN_TTL_SECONDS } from "@/features/verification-tokens/constants/verificationTokenTTL.constants";

export const deleteCurrentVerificationToken = async ({
  userId,
  type,
}: DeleteCurrentVerificationToken) => {
  await redisClient.del(getCurrentVerificationKey({ userId, type }));
};

export const replaceCurrentVerificationToken = async ({
  verificationToken,
  userId,
  type,
  verificationData,
}: ReplaceCurrentVerificationTokenInput) => {
  const verificationKey = getVerificationTokenKey(verificationToken);

  const currentVerificationKey = getCurrentVerificationKey({
    userId: userId.toString(),
    type,
  });

  await redisClient.eval(
    `
      local oldTokenHash = redis.call("GET", KEYS[2])

      if oldTokenHash then
        local oldVerificationKey = ARGV[3] .. oldTokenHash
        redis.call("DEL", oldVerificationKey)
      end

      redis.call(
        "SET",
        KEYS[1],
        ARGV[1],
        "EX",
        ARGV[2]
      )

      redis.call(
        "SET",
        KEYS[2],
        ARGV[4],
        "EX",
        ARGV[2]
      )
    `,
    {
      keys: [verificationKey, currentVerificationKey],
      arguments: [
        JSON.stringify(verificationData),
        VERIFICATION_TOKEN_TTL_SECONDS.toString(),
        "verification:",
        verificationToken,
      ],
    },
  );
};
