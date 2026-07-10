import { vi } from "vitest";

vi.mock(
  "@/features/email/services/sendPasswordChangeVerificationEmail.service.js",
  () => ({
    sendPasswordChangeVerificationEmail: vi.fn(),
  }),
);

import app from "@/app.js";
import { hashPassword } from "@/features/auth/utils/password.js";
import { sendPasswordChangeVerificationEmail } from "@/features/email/services/sendPasswordChangeVerificationEmail.service.js";
import { VerificationTokenModel } from "@/features/verification-tokens/models/verificationToken.model.js";
import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb.js";
import { createAuthedUserContext } from "@/test/helpers/testFactories.js";

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

describe("POST /auth/password/change-request", () => {
  it("returns 401 when the user is not authenticated", async () => {
    const response = await request(app)
      .post("/auth/password/change-request")
      .send({
        currentPassword: "Password123!",
        newPassword: "NewPassword123!",
        confirmPassword: "NewPassword123!",
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Not authenticated" });
  });

  it("returns 400 if invalid body", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .post("/auth/password/change-request")
      .send("invalid-body")
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid request body" });
  });

  it("returns 400 if the current password is invalid", async () => {
    const passwordHash = await hashPassword("Password123!");
    const { authCookie } = await createAuthedUserContext({
      passwordHash,
    });

    const response = await request(app)
      .post("/auth/password/change-request")
      .send({
        currentPassword: "WrongPassword123!",
        newPassword: "NewPassword123!",
        confirmPassword: "NewPassword123!",
      })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Current password is invalid",
    });
    expect(sendPasswordChangeVerificationEmail).not.toHaveBeenCalled();
  });

  it("returns 409 if the new password matches the current password", async () => {
    const passwordHash = await hashPassword("Password123!");
    const { authCookie } = await createAuthedUserContext({
      passwordHash,
    });

    const response = await request(app)
      .post("/auth/password/change-request")
      .send({
        currentPassword: "Password123!",
        newPassword: "Password123!",
        confirmPassword: "Password123!",
      })
      .set("Cookie", authCookie);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      message: "New password must be different from current password",
    });
    expect(sendPasswordChangeVerificationEmail).not.toHaveBeenCalled();
  });

  it("creates a password change token and sends a verification email", async () => {
    const passwordHash = await hashPassword("Password123!");
    const { authCookie, userId } = await createAuthedUserContext({
      email: "test@example.com",
      passwordHash,
    });

    const response = await request(app)
      .post("/auth/password/change-request")
      .send({
        currentPassword: "Password123!",
        newPassword: "NewPassword123!",
        confirmPassword: "NewPassword123!",
      })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Password change verification email sent",
    });

    const verificationToken = await VerificationTokenModel.findOne({
      userId,
      type: "password_change",
    });

    expect(verificationToken).not.toBeNull();
    expect(verificationToken?.newPasswordHash).toBeDefined();
    expect(verificationToken?.newPasswordHash).not.toBe(passwordHash);

    expect(sendPasswordChangeVerificationEmail).toHaveBeenCalledTimes(1);
    expect(sendPasswordChangeVerificationEmail).toHaveBeenCalledWith({
      to: "test@example.com",
      verificationUrl: expect.stringContaining("/confirm-password-change/"),
    });
  });
});
