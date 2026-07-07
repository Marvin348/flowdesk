import { vi } from "vitest";

vi.mock("@/features/email/services/sendAccountVerificationEmail.service.js", () => ({
  sendAccountVerificationEmail: vi.fn(),
}));

import app from "@/app.js";
import { sendAccountVerificationEmail } from "@/features/email/services/sendAccountVerificationEmail.service.js";
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

describe("POST /auth/register", () => {
  it("creates admin user + workspace + verification token + sends email", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "Password123!",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Registration successful. Please check your email.",
    });

    // Assert DB
    const user = await UserModel.findOne({ email: "test@example.com" });
    expect(user).not.toBeNull();

    if (!user) {
      throw new Error("Expected user to exist");
    }

    expect(user.role).toBe("admin");
    expect(user.workspaceId).toBeDefined();

    const workspace = await WorkspaceModel.findById(user?.workspaceId);
    expect(workspace).not.toBeNull();

    if (!workspace) {
      throw new Error("Expected workspace to exist");
    }

    expect(workspace.ownerId.toString()).toBe(user._id.toString());

    const verificationToken = await VerificationTokenModel.findOne({
      userId: user._id,
    });

    expect(verificationToken).not.toBeNull();

    expect(sendAccountVerificationEmail).toHaveBeenCalledWith({
      to: "test@example.com",
      verificationUrl: expect.stringContaining(
        "http://localhost:5173/verify-email/",
      ),
    });
  });

  it("returns 400 if request body is invalid", async () => {
    const response = await request(app).post("/auth/register");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid request body" });
  });

  it("returns 409 if email is already registered", async () => {
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

    const response = await request(app).post("/auth/register").send({
      name: "New User",
      email: "test@example.com",
      password: "Password123!",
    });

    expect(response.status).toBe(409);
    expect(await UserModel.countDocuments({ email: "test@example.com" })).toBe(
      1,
    );
    expect(await WorkspaceModel.countDocuments()).toBe(1);
  });
});
