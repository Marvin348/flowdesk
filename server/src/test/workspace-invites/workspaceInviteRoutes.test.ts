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

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("POST /workspace-invites/:token/accept", () => {
  it("creates a member user in an existing workspace when accepting a valid invite", async () => {
    const ownerId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Existing Workspace",
      ownerId,
    });

    await UserModel.create({
      _id: ownerId,
      email: "owner@example.com",
      name: "Workspace Owner",
      passwordHash: "hashed-password",
      workspaceId,
      role: "admin",
      isEmailVerified: true,
    });

    const invite = await WorkspaceInviteModel.create({
      email: "member@example.com",
      token: "valid-invite-token",
      workspaceId,
      role: "member",
      createdBy: ownerId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    const response = await request(app)
      .post(`/workspace-invites/${invite.token}/accept`)
      .send({
        name: "Test Member",
        password: "Password123!",
      });

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({
      name: "Test Member",
      email: "member@example.com",
      role: "member",
    });

    const member = await UserModel.findOne({ email: "member@example.com" });
    expect(member).not.toBeNull();

    if (!member) {
      throw new Error("Expected member to exist");
    }

    expect(member.role).toBe("member");
    expect(member.workspaceId.toString()).toBe(workspaceId.toString());

    const usedInvite = await WorkspaceInviteModel.findById(invite._id);

    if (!usedInvite) {
      throw new Error("Expected invite to exist");
    }

    expect(usedInvite.usedAt).toBeDefined();
    expect(await WorkspaceModel.countDocuments()).toBe(1);
  });
});
