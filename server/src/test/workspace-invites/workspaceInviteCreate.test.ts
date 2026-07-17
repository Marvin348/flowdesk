import { vi } from "vitest";

vi.mock(
  "@/features/email/services/sendWorkspaceInviteVerificationEmail.service",
  () => ({
    sendWorkspaceInviteVerificationEmail: vi.fn(),
  }),
);

import app from "@/app";
import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import { sendWorkspaceInviteVerificationEmail } from "@/features/email/services/sendWorkspaceInviteVerificationEmail.service";
import { WorkspaceInviteModel } from "@/features/workspace-invites/models/workspaceInvite.model";
import { createAuthedUserContext } from "@/test/helpers/testFactories";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  vi.clearAllMocks();
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("POST /workspace-invites", () => {
  it("creates a workspace invite when authenticated admin sends a valid email", async () => {
    const { authCookie, user, workspaceId } = await createAuthedUserContext();
    
    const response = await request(app)
      .post("/workspace-invites")
      .set("Cookie", authCookie)
      .send({
        email: "member@example.com",
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
    expect(invite.createdBy.toString()).toBe(user._id.toString());
    expect(invite.tokenHash).toBeDefined();
    expect(invite.expiresAt).toBeDefined();

    expect(sendWorkspaceInviteVerificationEmail).toHaveBeenCalledOnce();
  });

  it("returns 400 if the body is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .post("/workspace-invites")
      .set("Cookie", authCookie)
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
    const { authCookie } = await createAuthedUserContext({ role: "member" });

    const response = await request(app)
      .post("/workspace-invites")
      .set("Cookie", authCookie)
      .send({ email: "member@example.com" });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Only admins can create workspace-invites",
    });

    expect(sendWorkspaceInviteVerificationEmail).not.toHaveBeenCalled();
  });

  it("returns 409 if the email already exists", async () => {
    const { authCookie } = await createAuthedUserContext({
      email: "exists-email@test.de",
    });

    const response = await request(app)
      .post("/workspace-invites")
      .set("Cookie", authCookie)
      .send({ email: "exists-email@test.de" });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      message: "Email already exists",
    });

    expect(sendWorkspaceInviteVerificationEmail).not.toHaveBeenCalled();
  });
});
