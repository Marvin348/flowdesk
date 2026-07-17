import app from "@/app";
import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import { UserModel } from "@/features/users/models/user.modal";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model";
import { WorkspaceInviteModel } from "@/features/workspace-invites/models/workspaceInvite.model";
import { createAuthedUserContext } from "@/test/helpers/testFactories";
import { hashToken } from "@/utils/hashToken";

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
    const { user: owner, workspaceId } = await createAuthedUserContext();
    const token = "valid-invite-token";

    const invite = await WorkspaceInviteModel.create({
      email: "member@example.com",
      tokenHash: hashToken(token),
      workspaceId,
      role: "member",
      createdBy: owner._id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    const response = await request(app)
      .post(`/workspace-invites/${token}/accept`)
      .send({
        name: "Test Member",
        password: "Password123!",
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Invite was successfully",
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

  it("returns 400 if the body is invalid", async () => {
    const response = await request(app).post(
      "/workspace-invites/:token/accept",
    );

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid Input" });
  });

  it("returns 404 when the invite token does not exist", async () => {
    const response = await request(app)
      .post("/workspace-invites/unknown-invite-token/accept")
      .send({
        name: "Test Member",
        password: "Password123!",
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Token not found" });
    expect(await UserModel.countDocuments()).toBe(0);
  });

  it("returns 409 when the invite token was already used", async () => {
    const { user: owner, workspaceId } = await createAuthedUserContext();
    const token = "used-invite-token";

    await WorkspaceInviteModel.create({
      email: "member@example.com",
      tokenHash: hashToken(token),
      workspaceId,
      role: "member",
      createdBy: owner._id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      usedAt: new Date(),
    });

    const response = await request(app)
      .post(`/workspace-invites/${token}/accept`)
      .send({
        name: "Test Member",
        password: "Password123!",
      });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: "Token was already used" });
    expect(
      await UserModel.countDocuments({ email: "member@example.com" }),
    ).toBe(0);
  });
});
