import { afterEach, vi } from "vitest";
import type {
  ConsumeVerificationTokenInput,
  DeleteCurrentVerificationToken,
  ReplaceCurrentVerificationTokenInput,
  VerificationTokenData,
} from "@/features/verification-tokens/types/verificationToken";
import { hashToken } from "@/utils/hashToken";

const verificationTokenRepositoryMock = vi.hoisted(() => {
  const tokens = new Map<string, VerificationTokenData>();
  const currentTokens = new Map<string, string>();

  const getCurrentKey = (userId: string, type: string) => `${userId}:${type}`;

  return {
    tokens,
    currentTokens,

    seedVerificationToken: ({
      token,
      data,
    }: {
      token: string;
      data: VerificationTokenData;
    }) => {
      tokens.set(hashToken(token), data);
      currentTokens.set(
        getCurrentKey(data.userId, data.type),
        hashToken(token),
      );
    },

    consumeVerificationToken: vi.fn(
      async ({
        verificationToken,
        expectedType,
        expectedUserId,
      }: ConsumeVerificationTokenInput) => {
        const data = tokens.get(verificationToken);

        if (!data) return null;
        if (data.type !== expectedType) return null;
        if (expectedUserId && data.userId !== expectedUserId) return null;

        tokens.delete(verificationToken);
        return data;
      },
    ),

    deleteCurrentVerificationToken: vi.fn(
      async ({ userId, type }: DeleteCurrentVerificationToken) => {
        currentTokens.delete(getCurrentKey(userId, type));
      },
    ),

    replaceCurrentVerificationToken: vi.fn(
      async ({
        verificationToken,
        verificationData,
        type,
        userId,
      }: ReplaceCurrentVerificationTokenInput) => {
        const currentKey = getCurrentKey(userId, type);
        const oldToken = currentTokens.get(currentKey);

        if (oldToken) {
          tokens.delete(oldToken);
        }

        tokens.set(verificationToken, verificationData);
        currentTokens.set(currentKey, verificationToken);
      },
    ),
  };
});

vi.mock(
  "@/features/verification-tokens/repository/verificationToken.repository",
  () => ({
    consumeVerificationToken:
      verificationTokenRepositoryMock.consumeVerificationToken,
  }),
);

vi.mock(
  "@/features/verification-tokens/repository/currentVerificationToken.repository",
  () => ({
    deleteCurrentVerificationToken:
      verificationTokenRepositoryMock.deleteCurrentVerificationToken,
    replaceCurrentVerificationToken:
      verificationTokenRepositoryMock.replaceCurrentVerificationToken,
  }),
);

afterEach(() => {
  verificationTokenRepositoryMock.tokens.clear();
  verificationTokenRepositoryMock.currentTokens.clear();
});

export const verificationTokenMock = verificationTokenRepositoryMock;
