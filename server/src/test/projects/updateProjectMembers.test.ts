import app from "@/app.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb.js";
import request from "supertest";
import {
  createAuthedUserContext,
  createProject,
  createUser,
} from "@/test/helpers/testFactories.js";
import mongoose from "mongoose";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("PATCH /projects/:projectId/members", () => {
  it("returns 400 if the params are invalid", async () => {
    const { authCookie, userId } = await createAuthedUserContext();

    const response = await request(app)
      .patch(`/projects/:invalid-param/members`)
      .send({ userIdsToAdd: [userId] })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid params" });
  });

  it("returns 400 if the body is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();
    const projectId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .patch(`/projects/${projectId}/members`)
      .send({ userIdsToAdd: "invalid" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid body" });
  });

  it("returns 403 if the user is not a admin", async () => {
    const { authCookie, userId } = await createAuthedUserContext({
      role: "member",
    });
    const projectId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .patch(`/projects/${projectId}/members`)
      .send({ userIdsToAdd: [userId] })
      .set("Cookie", authCookie);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Only admins can update invitedUsers",
    });
  });

  it("returns 404 if the project not exists", async () => {
    const { authCookie, userId } = await createAuthedUserContext();
    const otherProjectId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .patch(`/projects/${otherProjectId}/members`)
      .send({ userIdsToAdd: [userId] })
      .set("Cookie", authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Project not found",
    });
  });

  it("returns 400 if a user does not exist", async () => {
    const { authCookie, workspaceId } = await createAuthedUserContext();
    const project = await createProject({ workspaceId });
    const missingUserId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .patch(`/projects/${project._id.toString()}/members`)
      .send({ userIdsToAdd: [missingUserId.toString()] })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "One or more users are invalid",
    });
  });

  it("returns 400 if a user is not in the workspace", async () => {
    const { authCookie, workspaceId } = await createAuthedUserContext();
    const project = await createProject({ workspaceId });
    const otherWorkspaceUser = await createUser({
      workspaceId: new mongoose.Types.ObjectId(),
    });

    const response = await request(app)
      .patch(`/projects/${project._id.toString()}/members`)
      .send({ userIdsToAdd: [otherWorkspaceUser._id.toString()] })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "One or more users are invalid",
    });
  });

  it("returns 200 and adds users to the project", async () => {
    const { authCookie, workspaceId } = await createAuthedUserContext();
    const firstUser = await createUser({ workspaceId });
    const secondUser = await createUser({ workspaceId });
    const project = await createProject({ workspaceId });

    const response = await request(app)
      .patch(`/projects/${project._id.toString()}/members`)
      .send({
        userIdsToAdd: [firstUser._id.toString(), secondUser._id.toString()],
      })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Update invitedUserIds successfully",
    });

    const updatedProject = await ProjectModel.findById(project._id).lean();
    expect(updatedProject).not.toBeNull();
    expect(updatedProject?.invitedUserIds.map((id) => id.toString()).sort()).toEqual(
      [firstUser._id.toString(), secondUser._id.toString()].sort(),
    );
  });

  it("returns 200 and does not duplicate users that are already in the project", async () => {
    const { authCookie, workspaceId } = await createAuthedUserContext();
    const existingUser = await createUser({ workspaceId });
    const newUser = await createUser({ workspaceId });
    const project = await createProject({
      workspaceId,
      invitedUserIds: [existingUser._id],
    });

    const response = await request(app)
      .patch(`/projects/${project._id.toString()}/members`)
      .send({
        userIdsToAdd: [existingUser._id.toString(), newUser._id.toString()],
      })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Update invitedUserIds successfully",
    });

    const updatedProject = await ProjectModel.findById(project._id).lean();
    expect(updatedProject).not.toBeNull();

    const invitedUserIds =
      updatedProject?.invitedUserIds.map((id) => id.toString()) ?? [];

    expect(invitedUserIds.sort()).toEqual(
      [existingUser._id.toString(), newUser._id.toString()].sort(),
    );
    expect(
      invitedUserIds.filter((id) => id === existingUser._id.toString()),
    ).toHaveLength(1);
  });
});
