import { SESSION_TTL_SECONDS } from "@/features/sessions/constants/session.constants";
import { saveSession } from "@/features/sessions/repository/session.repository";
import { Types } from "mongoose";
import { createRandomToken } from "@/utils/createRandomToken";
import { addUserSessions } from "@/features/sessions/repository/userSessions.repository";

type CreateSessionInput = {
  userId: Types.ObjectId;
  sessionMetadata: {
    userAgent?: string;
    userIp?: string;
  };
};

export const createSession = async ({
  userId,
  sessionMetadata,
}: CreateSessionInput): Promise<string> => {
  const sessionId = createRandomToken();

  const createdAt = new Date();
  const absoluteExpiresAt = new Date(
    createdAt.getTime() + SESSION_TTL_SECONDS * 1000,
  );

  const sessionData = {
    userId: userId.toString(),
    createdAt: createdAt.toISOString(),
    absoluteExpiresAt: absoluteExpiresAt.toISOString(),
    userAgent: sessionMetadata.userAgent,
    userIp: sessionMetadata.userIp,
  };

  await saveSession({ sessionId, session: sessionData });
  await addUserSessions({ sessionId, userId: userId.toString() });

  return sessionId;
};
