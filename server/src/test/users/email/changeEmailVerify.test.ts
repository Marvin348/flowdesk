import {
  beforeAll,
  beforeEach,
  afterAll,
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import app from "@/app";
import request from "supertest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import { UserModel } from "@/features/users/models/user.modal";
import mongoose from "mongoose";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model";
import { createAuthCookie } from "@/test/helpers/testFactories";
import { notificationQueue } from "@/queues/notificationQueue";
import { verificationTokenMock } from "@/test/setupVerificationTokenRepositoryMock";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterEach(() => {
  vi.restoreAllMocks();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("POST /users/me/change-email/verify", () => {
  it("returns 400 if the token is invalid", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: userId,
    });

    await UserModel.create({
      _id: userId,
      email: "test@example.com",
      name: "Test User",
      passwordHash: "hashed-password",
      workspaceId,
      role: "admin",
      isEmailVerified: true,
    });

    const authCookie = await createAuthCookie(userId);

    const response = await request(app)
      .post("/users/me/change-email/verify")
      .send("fake-token")
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid token" });
  });

  it("returns 400 if the new email is missing", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: userId,
    });

    await UserModel.create({
      _id: userId,
      email: "test@example.com",
      name: "Test User",
      passwordHash: "hashed-password",
      workspaceId,
      role: "admin",
      isEmailVerified: true,
    });

    const token = "email-change-token-without-new-email";

    verificationTokenMock.seedVerificationToken({
      token,
      data: {
        userId: userId.toString(),
        type: "email_change",
      },
    });

    const authCookie = await createAuthCookie(userId);

    const response = await request(app)
      .post("/users/me/change-email/verify")
      .send({ token })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "New email does not exist" });
  });

  it("returns 400 if the token does not exist", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: userId,
    });

    await UserModel.create({
      _id: userId,
      email: "test@example.com",
      name: "Test User",
      passwordHash: "hashed-password",
      workspaceId,
      role: "admin",
      isEmailVerified: true,
    });

    const authCookie = await createAuthCookie(userId);

    const response = await request(app)
      .post("/users/me/change-email/verify")
      .send({ token: "missing-token" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Token not found" });
  });

  it("returns 409 if the new email is already in use", async () => {
    const userId = new mongoose.Types.ObjectId();
    const existingUserId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: userId,
    });

    await UserModel.create([
      {
        _id: userId,
        email: "test@example.com",
        name: "Test User",
        passwordHash: "hashed-password",
        workspaceId,
        role: "admin",
        isEmailVerified: true,
      },
      {
        _id: existingUserId,
        email: "taken@example.com",
        name: "Existing User",
        passwordHash: "hashed-password",
        workspaceId,
        role: "member",
        isEmailVerified: true,
      },
    ]);

    const token = "email-change-to-taken-address";

    verificationTokenMock.seedVerificationToken({
      token,
      data: {
        userId: userId.toString(),
        type: "email_change",
        newEmail: "taken@example.com",
      },
    });

    const authCookie = await createAuthCookie(userId);

    const response = await request(app)
      .post("/users/me/change-email/verify")
      .send({ token })
      .set("Cookie", authCookie);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: "Email already in use" });
  });

  it("returns 200 and updates the user's email", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: userId,
    });

    await UserModel.create({
      _id: userId,
      email: "test@example.com",
      name: "Test User",
      passwordHash: "hashed-password",
      workspaceId,
      role: "admin",
      isEmailVerified: true,
    });

    const token = "valid-email-change-token";

    verificationTokenMock.seedVerificationToken({
      token,
      data: {
        userId: userId.toString(),
        type: "email_change",
        newEmail: "new@example.com",
      },
    });

    const authCookie = await createAuthCookie(userId);
    const response = await request(app)
      .post("/users/me/change-email/verify")
      .send({ token })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Email successfully changed" });

    const updatedUser = await UserModel.findById(userId);
    expect(updatedUser?.email).toBe("new@example.com");
  });

  it("allows only one concurrent request to verify an email change token", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: userId,
    });

    await UserModel.create({
      _id: userId,
      email: "test@example.com",
      name: "Test User",
      passwordHash: "hashed-password",
      workspaceId,
      role: "admin",
      isEmailVerified: true,
    });

    const token = "concurrent-email-change-token";

    verificationTokenMock.seedVerificationToken({
      token,
      data: {
        userId: userId.toString(),
        type: "email_change",
        newEmail: "new@example.com",
      },
    });

    const queueAddMock = vi.mocked(notificationQueue.add);
    const authCookie = await createAuthCookie(userId);

    const responses = await Promise.all([
      request(app)
        .post("/users/me/change-email/verify")
        .send({ token })
        .set("Cookie", authCookie),
      request(app)
        .post("/users/me/change-email/verify")
        .send({ token })
        .set("Cookie", authCookie),
    ]);

    const statuses = responses.map((response) => response.status).sort();

    expect(statuses).toEqual([200, 400]);
    expect(responses.find((response) => response.status === 400)?.body).toEqual(
      {
        message: "Token not found",
      },
    );

    const updatedUser = await UserModel.findById(userId);
    expect(updatedUser?.email).toBe("new@example.com");

    expect(queueAddMock).toHaveBeenCalledTimes(1);
    expect(queueAddMock).toHaveBeenCalledWith("user-email.changed", {
      workspaceId: workspaceId.toString(),
      recipientId: userId.toString(),
    });
  });
});
