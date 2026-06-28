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

describe("POST /auth/verify-email", () => {
  it("returns 400 if the body is invalid", async () => {
    const response = await request(app).post("/auth/verify-email");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid request body" });
  });

  it("verifies the user's email when the token is valid", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();
    const token = "valid-verification-token";

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

    const verificationToken = await VerificationTokenModel.create({
      userId,
      tokenHash: hashToken(token),
      type: "email_verification",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    const response = await request(app).post("/auth/verify-email").send({
      token,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Email verified successfully.",
    });

    const verifiedUser = await UserModel.findById(userId);
    expect(verifiedUser).not.toBeNull();

    if (!verifiedUser) {
      throw new Error("Expected verified user to exist");
    }

    expect(verifiedUser.isEmailVerified).toBe(true);
    expect(verifiedUser.emailVerifiedAt).toBeDefined();

    const usedToken = await VerificationTokenModel.findById(
      verificationToken._id,
    );

    if (!usedToken) {
      throw new Error("Expected verification token to exist");
    }

    expect(usedToken.usedAt).toBeDefined();
  });

  it("returns 400 when the verification token is invalid", async () => {
    const response = await request(app).post("/auth/verify-email").send({
      token: "invalid-verification-token",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Token not found" });
  });
});