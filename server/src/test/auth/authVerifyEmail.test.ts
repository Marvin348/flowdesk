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
import { verificationTokenMock } from "@/test/setupVerificationTokenRepositoryMock";

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

    verificationTokenMock.seedVerificationToken({
      token,
      data: {
        userId: userId.toString(),
        type: "email_verification",
      },
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
  });

  it("returns 400 when the verification token is invalid", async () => {
    const response = await request(app).post("/auth/verify-email").send({
      token: "invalid-verification-token",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Token not found" });
  });

  it("returns 404 when the verification token user does not exist", async () => {
    const userId = new mongoose.Types.ObjectId();
    const token = "missing-user-verification-token";

    verificationTokenMock.seedVerificationToken({
      token,
      data: {
        userId: userId.toString(),
        type: "email_verification",
      },
    });

    const response = await request(app).post("/auth/verify-email").send({
      token,
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "User not found" });
  });

  it("allows only one concurrent request to verify an email verification token", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();
    const token = "concurrent-verification-token";

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

    verificationTokenMock.seedVerificationToken({
      token,
      data: {
        userId: userId.toString(),
        type: "email_verification",
      },
    });

    const responses = await Promise.all([
      request(app).post("/auth/verify-email").send({ token }),
      request(app).post("/auth/verify-email").send({ token }),
    ]);

    const statuses = responses.map((response) => response.status).sort();

    expect(statuses).toEqual([200, 400]);
    expect(
      responses.find((response) => response.status === 400)?.body,
    ).toEqual({
      message: "Token not found",
    });

    const verifiedUser = await UserModel.findById(userId);
    expect(verifiedUser).not.toBeNull();
    expect(verifiedUser?.isEmailVerified).toBe(true);
    expect(verifiedUser?.emailVerifiedAt).toBeInstanceOf(Date);
  });
});
