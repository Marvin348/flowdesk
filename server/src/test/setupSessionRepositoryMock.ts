import { afterEach, vi } from "vitest";
import type { SessionData } from "@/features/sessions/types/session.types";

const sessionRepositoryMock = vi.hoisted(() => {
  const sessions = new Map<string, SessionData>();

  return {
    sessions,

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
  };
});

vi.mock("@/features/sessions/repository/session.repository", () => ({
  saveSession: sessionRepositoryMock.saveSession,
  findSession: sessionRepositoryMock.findSession,
  deleteSession: sessionRepositoryMock.deleteSession,
}));

afterEach(() => {
  sessionRepositoryMock.sessions.clear();
  vi.clearAllMocks();
});
