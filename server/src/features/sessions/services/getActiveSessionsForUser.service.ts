import { findSession } from "@/features/sessions/repository/session.repository";
import {
  getUserSessions,
  removeUserSessions,
} from "@/features/sessions/repository/userSessions.repository";
import {
  SessionWithId,
  toUserSessionsDto,
} from "@/features/sessions/mappers/mapUserSessions.mapper";

type GetActiveSessionsForUserInput = {
  userId: string;
  currentSessionId: string;
};

export const getActiveSessionsForUser = async ({
  userId,
  currentSessionId,
}: GetActiveSessionsForUserInput) => {
  const userSessions = await getUserSessions(userId);

  const sessions = await Promise.all(
    userSessions.map(async (sessionId) => {
      const session = await findSession(sessionId);

      return {
        sessionId,
        session,
      };
    }),
  );

  const expiredSessionIds = sessions
    .filter((item) => item.session === null)
    .map((item) => item.sessionId);

  if (expiredSessionIds.length > 0) {
    await removeUserSessions({ userId, sessionIds: expiredSessionIds });
  }

  const activeSessions = sessions.filter(
    (item): item is SessionWithId => item.session !== null,
  );

  return activeSessions.map((session) =>
    toUserSessionsDto(session, currentSessionId),
  );
};
