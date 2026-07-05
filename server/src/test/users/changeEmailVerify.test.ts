import app from "@/app.js";
import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import mongoose from "mongoose";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model.js";
import { createAccessToken } from "@/features/auth/utils/tokens.js";
import { VerificationTokenModel } from "@/features/verification-tokens/models/verificationToken.model.js";
import { hashToken } from "@/utils/hashToken.js";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
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

    const accessToken = createAccessToken(userId.toString());

    const response = await request(app)
      .post("/users/me/change-email/verify")
      .send("fake-token")
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid token" });
  });

  it("returns 410 if token expired", async () => {
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

    const accessToken = createAccessToken(userId.toString());
    const token = "expired-email-change-token";

    await VerificationTokenModel.create({
      userId,
      tokenHash: hashToken(token),
      type: "email_change",
      newEmail: "new@example.com",
      expiresAt: new Date(Date.now() - 60_000),
    });

    const response = await request(app)
      .post("/users/me/change-email/verify")
      .send({ token })
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(410);
    expect(response.body).toEqual({ message: "Token has expired" });
  });

  it("returns 403 if the token belongs to another user", async () => {
    const userId = new mongoose.Types.ObjectId();
    const otherUserId = new mongoose.Types.ObjectId();
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
        _id: otherUserId,
        email: "other@example.com",
        name: "Other User",
        passwordHash: "hashed-password",
        workspaceId,
        role: "member",
        isEmailVerified: true,
      },
    ]);

    const token = "another-users-email-change-token";

    await VerificationTokenModel.create({
      userId: otherUserId,
      tokenHash: hashToken(token),
      type: "email_change",
      newEmail: "new@example.com",
      expiresAt: new Date(Date.now() + 60_000),
    });

    const accessToken = createAccessToken(userId.toString());
    const response = await request(app)
      .post("/users/me/change-email/verify")
      .send({ token })
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: "UserId is wrong" });
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

    await VerificationTokenModel.create({
      userId,
      tokenHash: hashToken(token),
      type: "email_change",
      newEmail: "taken@example.com",
      expiresAt: new Date(Date.now() + 60_000),
    });

    const accessToken = createAccessToken(userId.toString());
    const response = await request(app)
      .post("/users/me/change-email/verify")
      .send({ token })
      .set("Cookie", [`accessToken=${accessToken}`]);

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

    await VerificationTokenModel.create({
      userId,
      tokenHash: hashToken(token),
      type: "email_change",
      newEmail: "new@example.com",
      expiresAt: new Date(Date.now() + 60_000),
    });

    const accessToken = createAccessToken(userId.toString());
    const response = await request(app)
      .post("/users/me/change-email/verify")
      .send({ token })
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Email successfully changed" });

    const updatedUser = await UserModel.findById(userId);
    expect(updatedUser?.email).toBe("new@example.com");
  });

  it("returns 200 and marks the verification token as used", async () => {
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

    const token = "valid-token-to-mark-as-used";
    const verificationToken = await VerificationTokenModel.create({
      userId,
      tokenHash: hashToken(token),
      type: "email_change",
      newEmail: "new@example.com",
      expiresAt: new Date(Date.now() + 60_000),
    });

    const accessToken = createAccessToken(userId.toString());
    const response = await request(app)
      .post("/users/me/change-email/verify")
      .send({ token })
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(200);

    const usedToken = await VerificationTokenModel.findById(
      verificationToken._id,
    );
    expect(usedToken?.usedAt).toBeInstanceOf(Date);
  });
});
