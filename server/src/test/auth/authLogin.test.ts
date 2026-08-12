import app from "@/app";
import request from "supertest";
import {
  beforeAll,
  beforeEach,
  afterAll,
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
import { UserModel } from "@/features/users/models/user.modal";
import mongoose from "mongoose";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model";
import bcrypt from "bcryptjs";
import { saveSession } from "@/features/sessions/repository/session.repository";
import { addUserSessions } from "@/features/sessions/repository/userSessions.repository";

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

describe("POST /auth/login", () => {
  it("returns 200 when the login was successful", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: userId,
    });

    const password = "Password123!";
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      _id: userId,
      email: "test@example.com",
      name: "Test User",
      passwordHash,
      workspaceId,
      role: "admin",
      isEmailVerified: true,
    });

    const response = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password,
    });

    expect(response.status).toBe(200);

    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.headers["set-cookie"][0]).toContain("sessionId=");
    expect(saveSession).toHaveBeenCalledWith({
      sessionId: expect.any(String),
      session: expect.objectContaining({
        userId: user._id.toString(),
        createdAt: expect.any(String),
        absoluteExpiresAt: expect.any(String),
      }),
    });

    const savedSessionId = vi.mocked(saveSession).mock.calls[0][0].sessionId;

    expect(addUserSessions).toHaveBeenCalledWith({
      userId: user._id.toString(),
      sessionId: savedSessionId,
    });

    expect(response.body.user).toMatchObject({
      id: user._id.toString(),
      name: "Test User",
      email: "test@example.com",
      role: "admin",
    });
  });

  it("returns 400 when request body is invalid", async () => {
    const response = await request(app).post("/auth/login").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid request body" });
  });

  it("return 403 when the email is not verified", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();
    const password = "Password123!";
    const passwordHash = await bcrypt.hash(password, 10);

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: userId,
    });

    await UserModel.create({
      _id: userId,
      email: "test@example.com",
      name: "Test User",
      passwordHash,
      workspaceId,
      role: "admin",
      isEmailVerified: false,
    });

    const response = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password,
    });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Please verify your email first.",
    });
    expect(response.headers["set-cookie"]).toBeUndefined();
  });

  it("returns 401 when the password is incorrect", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();
    const passwordHash = await bcrypt.hash("Password123!", 10);

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: userId,
    });

    await UserModel.create({
      _id: userId,
      email: "test@example.com",
      name: "Test User",
      passwordHash,
      workspaceId,
      role: "admin",
      isEmailVerified: true,
    });

    const response = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "WrongPassword123!",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid credentials" });
    expect(response.headers["set-cookie"]).toBeUndefined();
  });
});
