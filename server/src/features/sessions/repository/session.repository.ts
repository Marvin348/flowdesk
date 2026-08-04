import { redisClient } from "@/shared/config/redis";
import { SESSION_TTL_SECONDS } from "@/features/sessions/constants/session.constants";
import { getSessionKey } from "@/features/sessions/utils/getSessionKey";
import type { SessionData } from "@/features/sessions/types/session.types";

type SaveSessionInput = {
  sessionId: string;
  session: SessionData;
};

export const saveSession = async ({ sessionId, session }: SaveSessionInput) => {
  await redisClient.set(getSessionKey(sessionId), JSON.stringify(session), {
    EX: SESSION_TTL_SECONDS,
  });
};

export const findSession = async (
  sessionId: string,
): Promise<SessionData | null> => {
  const value = await redisClient.get(getSessionKey(sessionId));

  if (!value) {
    return null;
  }

  return JSON.parse(value) as SessionData;
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  await redisClient.del(getSessionKey(sessionId));
};
