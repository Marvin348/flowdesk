import { vi } from "vitest";

vi.mock(
  "@/features/email/services/sendEmailChangeVerificationEmail.service",
  () => ({
    sendEmailChangeVerificationEmail: vi.fn(),
  }),
);

import app from "@/app";
import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import { UserModel } from "@/features/users/models/user.modal";
import mongoose from "mongoose";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model";
import { createAccessToken } from "@/features/auth/utils/tokens";
import { VerificationTokenModel } from "@/features/verification-tokens/models/verificationToken.model";
import { sendEmailChangeVerificationEmail } from "@/features/email/services/sendEmailChangeVerificationEmail.service";

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

describe("PATCH /users/me/change-email", () => {
  it("returns 400 if the email is invalid", async () => {
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
      .patch("/users/me/change-email")
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid email" });
  });

  it("returns 409 if the email is the same", async () => {
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
      .patch("/users/me/change-email")
      .send({ email: "test@example.com" })
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: "Email is already same" });
  });

  it("returns 401 if the user is not verified", async () => {
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
      isEmailVerified: false,
    });

    const accessToken = createAccessToken(userId.toString());

    const response = await request(app)
      .patch("/users/me/change-email")
      .send({ email: "test@example.com" })
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Email needs to be verifyt" });
  });

  it("returns 200 and creates an email_change token with the new email", async () => {
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
      .patch("/users/me/change-email")
      .send({ email: "new@example.com" })
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Email verification has been send",
    });

    const verificationToken = await VerificationTokenModel.findOne({
      userId,
      type: "email_change",
    });

    expect(verificationToken).not.toBeNull();
    expect(verificationToken?.newEmail).toBe("new@example.com");
  });

  it("returns 200 and calls the email change mail service", async () => {
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
      .patch("/users/me/change-email")
      .send({ email: "new@example.com" })
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(200);
    expect(sendEmailChangeVerificationEmail).toHaveBeenCalledTimes(1);
    expect(sendEmailChangeVerificationEmail).toHaveBeenCalledWith({
      to: "new@example.com",
      newEmail: "new@example.com",
      verificationUrl: expect.stringContaining("/confirm-email-change/"),
    });
  });
});
