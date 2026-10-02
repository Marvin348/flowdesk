import app from "@/app";
import request from "supertest";
import {
  beforeAll,
  beforeEach,
  afterAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import { UserModel } from "@/features/users/models/user.modal";
import mongoose from "mongoose";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model";
import { verificationTokenMock } from "@/test/setupVerificationTokenRepositoryMock";
import { EmailDeliveryModel } from "@/features/emailDelivery/models/emailDelivery.model";
import { emailQueue } from "@/queues/emailQueue";

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
  it("creates admin user + workspace + verification token + queues email", async () => {
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

    expect(
      verificationTokenMock.replaceCurrentVerificationToken,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        verificationToken: expect.any(String),
        userId: user._id.toString(),
        type: "email_verification",
        verificationData: {
          userId: user._id.toString(),
          type: "email_verification",
        },
      }),
    );

    const delivery = await EmailDeliveryModel.findOne({
      userId: user._id,
      type: "account-verification",
    });

    expect(delivery).not.toBeNull();

    if (!delivery) {
      throw new Error("Expected email delivery to exist");
    }

    expect(delivery.status).toBe("pending");
    expect(delivery.queuedAt).toBeInstanceOf(Date);
    expect(delivery.encryptedPayload).toEqual({
      ciphertext: expect.any(String),
      iv: expect.any(String),
      authTag: expect.any(String),
    });

    expect(emailQueue.add).toHaveBeenCalledWith(
      "account-verification",
      {
        deliveryId: delivery._id.toString(),
      },
      {
        jobId: `email-${delivery._id.toString()}`,
      },
    );
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
