import app from "@/app";
import { deleteSession } from "@/features/sessions/repository/session.repository";
import { removeUserSessions } from "@/features/sessions/repository/userSessions.repository";
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
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import { createAuthedUserContext } from "@/test/helpers/testFactories";

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

describe("POST /auth/logout", () => {
  it("deletes the current session and clears the session cookie", async () => {
    const { authCookie, sessionId, userId } = await createAuthedUserContext();

    const response = await request(app)
      .post("/auth/logout")
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Logout successful" });
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.headers["set-cookie"][0]).toContain("sessionId=");
    expect(response.headers["set-cookie"][0]).toContain("Expires=Thu, 01 Jan 1970");
    expect(deleteSession).toHaveBeenCalledWith(sessionId);
    expect(removeUserSessions).toHaveBeenCalledWith({
      userId: userId.toString(),
      sessionIds: [sessionId],
    });
  });

  it("returns 401 when no session cookie is present", async () => {
    const response = await request(app).post("/auth/logout");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Not authenticated" });
    expect(deleteSession).not.toHaveBeenCalled();
    expect(removeUserSessions).not.toHaveBeenCalled();
  });
});
