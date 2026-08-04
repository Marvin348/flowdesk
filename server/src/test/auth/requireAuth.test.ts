import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
import mongoose from "mongoose";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { requireAuth } from "@/features/auth/middleware/requireAuth";
import { findSession } from "@/features/sessions/repository/session.repository";
import { errorHandler } from "@/middleware/errorHandler";
import { UserModel } from "@/features/users/models/user.modal";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import { createUser, createWorkspace } from "@/test/helpers/testFactories";

vi.mock("@/features/sessions/repository/session.repository", () => ({
  saveSession: vi.fn(),
  findSession: vi.fn(),
  deleteSession: vi.fn(),
}));

const buildTestApp = () => {
  const app = express();

  app.use(cookieParser());
  app.get("/protected", requireAuth, (req, res) => {
    res.status(200).json({ user: req.user });
  });
  app.use(errorHandler);

  return app;
};

const app = buildTestApp();

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

describe("requireAuth", () => {
  it("returns 401 when no session cookie is present", async () => {
    const response = await request(app).get("/protected");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Not authenticated" });
    expect(findSession).not.toHaveBeenCalled();
  });

  it("returns 401 when the session does not exist", async () => {
    vi.mocked(findSession).mockResolvedValue(null);

    const response = await request(app)
      .get("/protected")
      .set("Cookie", ["sessionId=missing-session"]);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Session expired or invalid" });
    expect(findSession).toHaveBeenCalledWith("missing-session");
  });

  it("returns 401 when the session user does not exist", async () => {
    const userId = new mongoose.Types.ObjectId();

    vi.mocked(findSession).mockResolvedValue({
      userId: userId.toString(),
      createdAt: new Date().toISOString(),
      absoluteExpiresAt: new Date(Date.now() + 60_000).toISOString(),
    });

    const response = await request(app)
      .get("/protected")
      .set("Cookie", ["sessionId=valid-session"]);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid User" });
  });

  it("returns 401 when the session user has no workspace", async () => {
    const userId = new mongoose.Types.ObjectId();

    await createUser({
      _id: userId,
    });
    await UserModel.updateOne({ _id: userId }, { $unset: { workspaceId: "" } });

    vi.mocked(findSession).mockResolvedValue({
      userId: userId.toString(),
      createdAt: new Date().toISOString(),
      absoluteExpiresAt: new Date(Date.now() + 60_000).toISOString(),
    });

    const response = await request(app)
      .get("/protected")
      .set("Cookie", ["sessionId=valid-session"]);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "WorkspaceId not found" });
  });

  it("attaches the authenticated user to the request", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();

    await createWorkspace({
      _id: workspaceId,
      ownerId: userId,
    });
    await createUser({
      _id: userId,
      workspaceId,
      role: "manager",
    });

    vi.mocked(findSession).mockResolvedValue({
      userId: userId.toString(),
      createdAt: new Date().toISOString(),
      absoluteExpiresAt: new Date(Date.now() + 60_000).toISOString(),
    });

    const response = await request(app)
      .get("/protected")
      .set("Cookie", ["sessionId=valid-session"]);

    expect(response.status).toBe(200);
    expect(response.body.user).toEqual({
      id: userId.toString(),
      workspaceId: workspaceId.toString(),
      role: "manager",
    });
    expect(findSession).toHaveBeenCalledWith("valid-session");
  });
});
