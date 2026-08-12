import app from "@/app";
import { createSession } from "@/features/sessions/services/createSession.service";
import {
  addUserSessions,
  getUserSessions,
  removeUserSessions,
} from "@/features/sessions/repository/userSessions.repository";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import {
  createUser,
  createWorkspace,
} from "@/test/helpers/testFactories";
import mongoose from "mongoose";
import request from "supertest";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const chromeDesktopUserAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const safariMobileUserAgent =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 " +
  "(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
  vi.clearAllMocks();
});

afterAll(async () => {
  await disconnectTestDb();
});

const createUserWithSessions = async () => {
  const userId = new mongoose.Types.ObjectId();
  const workspaceId = new mongoose.Types.ObjectId();

  await createWorkspace({
    _id: workspaceId,
    ownerId: userId,
  });

  const user = await createUser({
    _id: userId,
    workspaceId,
  });

  const currentSessionId = await createSession({
    userId: user._id,
    sessionMetadata: {
      userAgent: chromeDesktopUserAgent,
      userIp: "127.0.0.1",
    },
  });

  const otherSessionId = await createSession({
    userId: user._id,
    sessionMetadata: {
      userAgent: safariMobileUserAgent,
      userIp: "127.0.0.2",
    },
  });

  return {
    user,
    currentSessionId,
    otherSessionId,
    authCookie: [`sessionId=${currentSessionId}`],
  };
};

describe("GET /auth/sessions", () => {
  it("returns 401 when no session cookie is present", async () => {
    const response = await request(app).get("/auth/sessions");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Not authenticated" });
    expect(getUserSessions).not.toHaveBeenCalled();
  });

  it("returns the active sessions for the authenticated user", async () => {
    const { authCookie, currentSessionId, otherSessionId } =
      await createUserWithSessions();

    const response = await request(app)
      .get("/auth/sessions")
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.userSessions).toHaveLength(2);
    expect(response.body.userSessions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sessionId: currentSessionId,
          browser: "Chrome",
          os: "macOS",
          deviceType: "desktop",
          createdAt: expect.any(String),
          isCurrent: true,
        }),
        expect.objectContaining({
          sessionId: otherSessionId,
          browser: "Mobile Safari",
          os: "iOS",
          deviceType: "mobile",
          createdAt: expect.any(String),
          isCurrent: false,
        }),
      ]),
    );
  });

  it("removes expired session ids from the user session lookup", async () => {
    const { authCookie, currentSessionId, user } = await createUserWithSessions();
    const expiredSessionId = "expired-session-id";

    await addUserSessions({
      userId: user._id.toString(),
      sessionId: expiredSessionId,
    });

    const response = await request(app)
      .get("/auth/sessions")
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.userSessions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sessionId: currentSessionId,
          isCurrent: true,
        }),
      ]),
    );
    expect(response.body.userSessions).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sessionId: expiredSessionId,
        }),
      ]),
    );
    expect(removeUserSessions).toHaveBeenCalledWith({
      userId: user._id.toString(),
      sessionIds: [expiredSessionId],
    });
  });
});
