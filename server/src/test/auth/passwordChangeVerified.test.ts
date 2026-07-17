import app from "@/app";
import { hashPassword } from "@/features/auth/utils/password";
import { VerificationTokenModel } from "@/features/verification-tokens/models/verificationToken.model";
import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import { createAuthedUserContext } from "@/test/helpers/testFactories";
import { hashToken } from "@/utils/hashToken";
import mongoose from "mongoose";
import { UserModel } from "@/features/users/models/user.modal";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("POST auth/password/change/verify", () => {
  it("returns 400 if the body is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .post("/auth/password/change/verify")
      .send("invalid-token")
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid token" });
  });

  it("returns 409 if the token was used", async () => {
    const token = "valid-password-change-token";
    const newPasswordHash = await hashPassword("NewPassword123!");

    const { authCookie, userId } = await createAuthedUserContext();

    await VerificationTokenModel.create({
      userId,
      tokenHash: hashToken(token),
      newPasswordHash,
      type: "password_change",
      usedAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    const response = await request(app)
      .post("/auth/password/change/verify")
      .send({ token })
      .set("Cookie", authCookie);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: "Token was already used" });
  });

  it("returns 410 if the token was expired", async () => {
    const token = "valid-password-change-token";
    const newPasswordHash = await hashPassword("NewPassword123!");

    const { authCookie, userId } = await createAuthedUserContext();

    await VerificationTokenModel.create({
      userId,
      tokenHash: hashToken(token),
      newPasswordHash,
      type: "password_change",
      expiresAt: new Date(Date.now() - 60_000),
    });

    const response = await request(app)
      .post("/auth/password/change/verify")
      .send({ token })
      .set("Cookie", authCookie);

    expect(response.status).toBe(410);
    expect(response.body).toEqual({ message: "Token has expired" });
  });

  it("returns if the userId is not the same", async () => {
    const { authCookie } = await createAuthedUserContext();

    const token = "valid-password-change-token";
    const otherUserId = new mongoose.Types.ObjectId();

    await VerificationTokenModel.create({
      userId: otherUserId,
      tokenHash: hashToken(token),
      newPasswordHash: await hashPassword("NewPassword123!"),
      type: "password_change",
      expiresAt: new Date(Date.now() + 60_000),
    });

    const response = await request(app)
      .post("/auth/password/change/verify")
      .send({ token })
      .set("Cookie", authCookie);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Token does not belong to this user",
    });
  });

  it("returns if the new password is missing", async () => {
    const token = "valid-password-change-token";
    const { authCookie, userId } = await createAuthedUserContext();

    await VerificationTokenModel.create({
      userId,
      tokenHash: hashToken(token),
      type: "password_change",
      expiresAt: new Date(Date.now() + 60_000),
    });

    const response = await request(app)
      .post("/auth/password/change/verify")
      .send({ token })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "New password is missing",
    });
  });

  it("changes the password successfully", async () => {
    const token = "valid-password-change-token";
    const { authCookie, userId } = await createAuthedUserContext();

    const verificationToken = await VerificationTokenModel.create({
      userId,
      tokenHash: hashToken(token),
      type: "password_change",
      newPasswordHash: await hashPassword("NewPassword123!"),
      expiresAt: new Date(Date.now() + 60_000),
    });

    const response = await request(app)
      .post("/auth/password/change/verify")
      .send({ token })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Password successfully changed",
    });

    const updatedUser =
      await UserModel.findById(userId).select("+passwordHash");

    expect(updatedUser).not.toBeNull();
    expect(updatedUser!.passwordHash).toBe(verificationToken.newPasswordHash);

    const usedToken = await VerificationTokenModel.findOne({
      tokenHash: hashToken(token),
    });

    expect(usedToken?.usedAt).toBeInstanceOf(Date);
  });
});
