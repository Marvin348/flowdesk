import { vi } from "vitest";

vi.mock(
  "@/features/email/services/sendAccountVerificationEmail.service.js",
  () => ({
    sendAccountVerificationEmail: vi.fn(),
  }),
);

import app from "@/app";
import { sendAccountVerificationEmail } from "@/features/email/services/sendAccountVerificationEmail.service";
import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import { UserModel } from "@/features/users/models/user.modal";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model";
import mongoose from "mongoose";
import { createAuthedUserContext } from "../helpers/testFactories";
import { verificationTokenMock } from "@/test/setupVerificationTokenRepositoryMock";

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
    const { userId } = await createAuthedUserContext({
      email: "test@example.com",
    });

    await UserModel.updateOne({
      _id: userId,
    }, {
      $set: {
        isEmailVerified: false,
      },
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

    expect(
      verificationTokenMock.replaceCurrentVerificationToken,
    ).toHaveBeenCalledTimes(1);

    expect(
      verificationTokenMock.replaceCurrentVerificationToken,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        verificationToken: expect.any(String),
        userId: userId.toString(),
        type: "email_verification",
        verificationData: {
          userId: userId.toString(),
          type: "email_verification",
        },
      }),
    );

    expect(sendAccountVerificationEmail).toHaveBeenCalledTimes(1);

    expect(sendAccountVerificationEmail).toHaveBeenCalledWith({
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
    expect(sendAccountVerificationEmail).not.toHaveBeenCalled();
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

    expect(sendAccountVerificationEmail).not.toHaveBeenCalled();
    expect(
      verificationTokenMock.replaceCurrentVerificationToken,
    ).not.toHaveBeenCalled();
  });
});
