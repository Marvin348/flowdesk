import { afterEach, vi } from "vitest";
import type { SessionData } from "@/features/sessions/types/session.types";

const sessionRepositoryMock = vi.hoisted(() => {
  const sessions = new Map<string, SessionData>();
  const userSessions = new Map<string, Set<string>>();

  return {
    sessions,
    userSessions,

    saveSession: vi.fn(async ({ sessionId, session }): Promise<void> => {
      sessions.set(sessionId, session);
    }),

    findSession: vi.fn(
      async (sessionId: string): Promise<SessionData | null> => {
        return sessions.get(sessionId) ?? null;
      },
    ),

    deleteSession: vi.fn(async (sessionId: string): Promise<void> => {
      sessions.delete(sessionId);
    }),

    addUserSessions: vi.fn(
      async ({
        userId,
        sessionId,
      }: {
        userId: string;
        sessionId: string;
      }): Promise<void> => {
        const sessionIds = userSessions.get(userId) ?? new Set<string>();
        sessionIds.add(sessionId);
        userSessions.set(userId, sessionIds);
      },
    ),

    getUserSessions: vi.fn(async (userId: string): Promise<string[]> => {
      return Array.from(userSessions.get(userId) ?? []);
    }),

    removeUserSessions: vi.fn(
      async ({
        userId,
        sessionIds,
      }: {
        userId: string;
        sessionIds: string[];
      }): Promise<void> => {
        const userSessionIds = userSessions.get(userId);

        if (!userSessionIds) {
          return;
        }

        sessionIds.forEach((sessionId) => userSessionIds.delete(sessionId));

        if (userSessionIds.size === 0) {
          userSessions.delete(userId);
        }
      },
    ),
  };
});

vi.mock("@/features/sessions/repository/session.repository", () => ({
  saveSession: sessionRepositoryMock.saveSession,
  findSession: sessionRepositoryMock.findSession,
  deleteSession: sessionRepositoryMock.deleteSession,
}));

vi.mock("@/features/sessions/repository/userSessions.repository", () => ({
  addUserSessions: sessionRepositoryMock.addUserSessions,
  getUserSessions: sessionRepositoryMock.getUserSessions,
  removeUserSessions: sessionRepositoryMock.removeUserSessions,
}));

afterEach(() => {
  sessionRepositoryMock.sessions.clear();
  sessionRepositoryMock.userSessions.clear();
  vi.clearAllMocks();
});
