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
import { ActivityModel } from "@/features/activity/models/activity.model";

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

  it("returns 410 when the invite token is expired", async () => {
    const { user: owner, workspaceId } = await createAuthedUserContext();
    const token = "expired-invite-token";

    await WorkspaceInviteModel.create({
      email: "member@example.com",
      tokenHash: hashToken(token),
      workspaceId,
      role: "member",
      createdBy: owner._id,
      expiresAt: new Date(Date.now() - 60_000),
    });

    const response = await request(app)
      .post(`/workspace-invites/${token}/accept`)
      .send({
        name: "Test Member",
        password: "Password123!",
      });

    expect(response.status).toBe(410);
    expect(response.body).toEqual({ message: "Invite has expired" });
    expect(
      await UserModel.countDocuments({ email: "member@example.com" }),
    ).toBe(0);
  });

  it("returns 409 and does not mark the invite as used when the email already exists", async () => {
    const { user: owner, workspaceId } = await createAuthedUserContext();
    const token = "email-already-used-invite-token";

    const invite = await WorkspaceInviteModel.create({
      email: "member@example.com",
      tokenHash: hashToken(token),
      workspaceId,
      role: "member",
      createdBy: owner._id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    await UserModel.create({
      email: "member@example.com",
      name: "Existing Member",
      passwordHash: "hashed-password",
      workspaceId,
      role: "member",
      isEmailVerified: true,
    });

    const response = await request(app)
      .post(`/workspace-invites/${token}/accept`)
      .send({
        name: "Test Member",
        password: "Password123!",
      });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: "Email already used" });
    expect(
      await UserModel.countDocuments({ email: "member@example.com" }),
    ).toBe(1);

    const unusedInvite = await WorkspaceInviteModel.findById(invite._id);
    expect(unusedInvite?.usedAt).toBeUndefined();
  });

  it("rolls back the invite usage when user creation fails inside the transaction", async () => {
    const { user: owner, workspaceId } = await createAuthedUserContext();
    const token = "rollback-invite-token";

    const invite = await WorkspaceInviteModel.create({
      email: "member@example.com",
      tokenHash: hashToken(token),
      workspaceId,
      role: "member",
      createdBy: owner._id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    await WorkspaceInviteModel.updateOne(
      { _id: invite._id },
      { $set: { role: "guest" } },
      { runValidators: false },
    );

    const response = await request(app)
      .post(`/workspace-invites/${token}/accept`)
      .send({
        name: "Test Member",
        password: "Password123!",
      });

    expect(response.status).toBe(500);
    expect(
      await UserModel.countDocuments({ email: "member@example.com" }),
    ).toBe(0);

    const unusedInvite = await WorkspaceInviteModel.findById(invite._id);
    expect(unusedInvite?.usedAt).toBeUndefined();
  });

  it("allows only one concurrent request to accept a workspace invite", async () => {
    const { user: owner, workspaceId } = await createAuthedUserContext();
    const token = "concurrent-invite-token";

    const invite = await WorkspaceInviteModel.create({
      email: "member@example.com",
      tokenHash: hashToken(token),
      workspaceId,
      role: "member",
      createdBy: owner._id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    const responses = await Promise.all([
      request(app)
        .post(`/workspace-invites/${token}/accept`)
        .send({
          name: "Test Member",
          password: "Password123!",
        }),
      request(app)
        .post(`/workspace-invites/${token}/accept`)
        .send({
          name: "Test Member",
          password: "Password123!",
        }),
    ]);

    const statuses = responses.map((response) => response.status).sort();

    expect(statuses).toEqual([201, 409]);
    expect(
      responses.find((response) => response.status === 409)?.body,
    ).toEqual({
      message: "Token was already used",
    });

    const member = await UserModel.findOne({ email: "member@example.com" });
    expect(member).not.toBeNull();
    expect(member?.role).toBe("member");
    expect(member?.workspaceId.toString()).toBe(workspaceId.toString());
    expect(
      await UserModel.countDocuments({ email: "member@example.com" }),
    ).toBe(1);

    const usedInvite = await WorkspaceInviteModel.findById(invite._id);
    expect(usedInvite?.usedAt).toBeDefined();

    expect(
      await ActivityModel.countDocuments({
        workspaceId,
        type: "workspace_invite.accepted",
        entityType: "workspace_invite",
        entityId: invite._id,
      }),
    ).toBe(1);
  });
});
