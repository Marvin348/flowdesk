import app from "@/app";
import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import mongoose from "mongoose";
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

describe("GET /workspace-invites/:token", () => {
  it("returns the invite when token is valid", async () => {
    const { userId, workspaceId, workspace } = await createAuthedUserContext();
    const token = "valid-invite-token";

    const invite = await WorkspaceInviteModel.create({
      email: "member@example.com",
      tokenHash: hashToken(token),
      workspaceId,
      role: "member",
      createdBy: userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    const response = await request(app).get(`/workspace-invites/${token}`);

    expect(response.status).toBe(200);
    expect(response.body.invite).toMatchObject({
      email: invite.email,
      workspaceName: workspace.name,
      expiresAt: invite.expiresAt.toISOString(),
    });
  });

  it("returns 404 when invite token does not exist", async () => {
    const response = await request(app).get("/workspace-invites/unknown-token");

    expect(response.status).toBe(404);
  });

  it("returns 404 when token does not match any invite", async () => {
    const { userId, workspaceId } = await createAuthedUserContext();
    const token = "valid-invite-token";

    await WorkspaceInviteModel.create({
      email: "member@example.com",
      tokenHash: hashToken(token),
      workspaceId,
      role: "member",
      createdBy: userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    const response = await request(app).get(`/workspace-invites/unknown-token`);

    expect(response.status).toBe(404);
  });

  it("returns 409 when invite was already used", async () => {
    const { userId, workspaceId } = await createAuthedUserContext();
    const token = "valid-invite-token";

    await WorkspaceInviteModel.create({
      email: "member@example.com",
      tokenHash: hashToken(token),
      workspaceId,
      role: "member",
      createdBy: userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      usedAt: new Date(),
    });

    const response = await request(app).get(`/workspace-invites/${token}`);

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({
      message: "Token was already used",
    });
  });

  it("returns 410 when invite is expired", async () => {
    const { userId, workspaceId } = await createAuthedUserContext();
    const token = "valid-invite-token";

    await WorkspaceInviteModel.create({
      email: "member@example.com",
      tokenHash: hashToken(token),
      workspaceId,
      role: "member",
      createdBy: userId,
      expiresAt: new Date(Date.now() - 1000 * 60),
    });

    const response = await request(app).get(`/workspace-invites/${token}`);

    expect(response.status).toBe(410);
    expect(response.body).toMatchObject({
      message: "Invite has expired",
    });
  });
});
