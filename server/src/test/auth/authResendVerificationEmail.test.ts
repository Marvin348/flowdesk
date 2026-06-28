import { vi } from "vitest";

vi.mock("@/features/email/services/email.service", () => ({
  sendVerificationEmail: vi.fn(),
}));

import app from "@/app.js";
import { sendVerificationEmail } from "@/features/email/services/email.service.js";
import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model.js";
import { VerificationTokenModel } from "@/features/verification-tokens/models/verificationToken.model.js";
import mongoose from "mongoose";
import { email } from "zod";

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

describe("POST /auth/resend-verification-email", () => {
  it("returns 400 if request body is inalid", async () => {
    const response = await request(app).post("/auth/resend-verification-email");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid email" });
  });

  it("returns 200 and sends a verification email when user exists and is not verified", async () => {
    const existingUserId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Existing Workspace",
      ownerId: existingUserId,
    });

    await UserModel.create({
      _id: existingUserId,
      email: "test@example.com",
      name: "Existing User",
      passwordHash: "hashed-password",
      workspaceId,
      role: "admin",
      isEmailVerified: false,
    });

    const response = await request(app)
      .post("/auth/resend-verification-email")
      .send({
        email: "test@example.com",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "If an account exists, a new verification email has been sent.",
    });

    const verificationToken = await VerificationTokenModel.findOne({
      userId: existingUserId,
    });

    expect(verificationToken).not.toBeNull();

    expect(sendVerificationEmail).toHaveBeenCalledTimes(1);

    expect(sendVerificationEmail).toHaveBeenCalledWith({
      to: "test@example.com",
      verificationUrl: expect.stringContaining("/verify-email/"),
    });
  });

  it("returns 200 without sending an email when the user does not exist", async () => {
    const response = await request(app)
      .post("/auth/resend-verification-email")
      .send({ email: "unknown@example.com" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "If an account exists, a new verification email has been sent.",
    });
    expect(sendVerificationEmail).not.toHaveBeenCalled();
  });

  it("returns 200 when user is already verified", async () => {
    const existingUserId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Existing Workspace",
      ownerId: existingUserId,
    });

    await UserModel.create({
      _id: existingUserId,
      email: "test@example.com",
      name: "Existing User",
      passwordHash: "hashed-password",
      workspaceId,
      role: "admin",
      isEmailVerified: true,
    });

    const response = await request(app)
      .post("/auth/resend-verification-email")
      .send({
        email: "test@example.com",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "If an account exists, a new verification email has been sent.",
    });

    expect(sendVerificationEmail).not.toHaveBeenCalled();

    const verificationToken = await VerificationTokenModel.findOne({
      userId: existingUserId,
    });

    expect(verificationToken).toBeNull();
  });
});
