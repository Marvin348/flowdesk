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
import { WorkspaceInviteModel } from "@/features/workspace-invites/models/workspaceInvite.model.js";
import { createAccessToken } from "@/features/auth/utils/tokens.js";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("POST /workspace-invites", () => {
  it("creates a workspace invite when authenticated admin sends a valid email", async () => {
    const adminId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: adminId,
    });

    const admin = await UserModel.create({
      _id: adminId,
      email: "admin@example.com",
      name: "Admin User",
      passwordHash: "hashed-password",
      workspaceId,
      role: "admin",
      isEmailVerified: true,
    });

    const accessToken = createAccessToken(admin._id.toString());

    const response = await request(app)
      .post("/workspace-invites")
      .set("Cookie", [`accessToken=${accessToken}`])
      .send({
        email: "member@example.com",
        role: "member",
      });

    expect(response.status).toBe(201);

    const invite = await WorkspaceInviteModel.findOne({
      email: "member@example.com",
      workspaceId,
    });

    expect(invite).not.toBeNull();

    if (!invite) {
      throw new Error("Expected invite to exist");
    }

    expect(invite.role).toBe("member");
    expect(invite.createdBy.toString()).toBe(admin._id.toString());
    expect(invite.token).toBeDefined();
    expect(invite.expiresAt).toBeDefined();
  });

  it("returns 400 if the body is invalid", async () => {
    const adminId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: adminId,
    });

    const admin = await UserModel.create({
      _id: adminId,
      email: "admin@example.com",
      name: "Admin User",
      passwordHash: "hashed-password",
      workspaceId,
      role: "admin",
      isEmailVerified: true,
    });

    const accessToken = createAccessToken(admin._id.toString());

    const response = await request(app)
      .post("/workspace-invites")
      .set("Cookie", [`accessToken=${accessToken}`])
      .send({ email: "not-an-email" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid email" });
  });

  it("returns 401 when user is not authenticated", async () => {
    const response = await request(app)
      .post("/workspace-invites")
      .send({ email: "member@example.com" });

    expect(response.status).toBe(401);
  });

  it("returns 403 if the user is not a admin", async () => {
    const ownerId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId,
    });

    const user = await UserModel.create({
      _id: userId,
      email: "member@example.com",
      name: "member User",
      passwordHash: "hashed-password",
      workspaceId,
      role: "member",
      isEmailVerified: true,
    });

    const accessToken = createAccessToken(user._id.toString());

    const response = await request(app)
      .post("/workspace-invites")
      .set("Cookie", [`accessToken=${accessToken}`])
      .send({ email: "member@example.com" });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Only admins can create workspace-invites",
    });
  });
});
