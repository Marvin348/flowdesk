import { vi } from "vitest";

vi.mock(
  "@/features/email/services/sendPasswordChangeVerificationEmail.service.js",
  () => ({
    sendPasswordChangeVerificationEmail: vi.fn(),
  }),
);

import app from "@/app";
import { hashPassword } from "@/features/auth/utils/password";
import { sendPasswordChangeVerificationEmail } from "@/features/email/services/sendPasswordChangeVerificationEmail.service";
import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import { createAuthedUserContext } from "@/test/helpers/testFactories";
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

  it("returns 403 if the password is from demo account", async () => {
    const previousDemoAccountEmail = process.env.DEMO_ACCOUNT_EMAIL;
    process.env.DEMO_ACCOUNT_EMAIL = "demo@example.com";

    try {
      const passwordHash = await hashPassword("Password123!");
      const { authCookie } = await createAuthedUserContext({
        email: process.env.DEMO_ACCOUNT_EMAIL,
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

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        message: "The demo account password cannot be changed.",
      });

      expect(
        verificationTokenMock.replaceCurrentVerificationToken,
      ).not.toHaveBeenCalled();

      expect(sendPasswordChangeVerificationEmail).not.toHaveBeenCalled();
    } finally {
      if (previousDemoAccountEmail === undefined) {
        delete process.env.DEMO_ACCOUNT_EMAIL;
      } else {
        process.env.DEMO_ACCOUNT_EMAIL = previousDemoAccountEmail;
      }
    }
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

    expect(
      verificationTokenMock.replaceCurrentVerificationToken,
    ).toHaveBeenCalledTimes(1);

    expect(
      verificationTokenMock.replaceCurrentVerificationToken,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        verificationToken: expect.any(String),
        userId: userId.toString(),
        type: "password_change",
        verificationData: expect.objectContaining({
          userId: userId.toString(),
          type: "password_change",
          newPasswordHash: expect.any(String),
        }),
      }),
    );

    const [{ verificationData }] = vi.mocked(
      verificationTokenMock.replaceCurrentVerificationToken,
    ).mock.calls[0];

    expect(verificationData.newPasswordHash).not.toBe(passwordHash);

    expect(sendPasswordChangeVerificationEmail).toHaveBeenCalledTimes(1);
    expect(sendPasswordChangeVerificationEmail).toHaveBeenCalledWith({
      to: "test@example.com",
      verificationUrl: expect.stringContaining("/confirm-password-change/"),
    });
  });
});
