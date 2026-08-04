import { SESSION_TTL_SECONDS } from "@/features/sessions/constants/session.constants";
import { saveSession } from "@/features/sessions/repository/session.repository";
import { Types } from "mongoose";
import { createRandomToken } from "@/utils/createRandomToken";

export const createSession = async (
  userId: Types.ObjectId,
): Promise<string> => {
  const sessionId = createRandomToken();

  const createdAt = new Date();
  const absoluteExpiresAt = new Date(
    createdAt.getTime() + SESSION_TTL_SECONDS * 1000,
  );

  const sessionData = {
    userId: userId.toString(),
    createdAt: createdAt.toISOString(),
    absoluteExpiresAt: absoluteExpiresAt.toISOString(),
  };

  await saveSession({ sessionId, session: sessionData });

  return sessionId;
};
