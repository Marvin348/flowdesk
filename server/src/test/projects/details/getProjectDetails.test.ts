import app from "@/app.js";
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
  createTask,
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

describe("GET /projects/:projectId/details", () => {
  it("returns 400 if the projectId is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .get(`/projects/invalid-id/details`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid projectId" });
  });

  it("returns 404 if the project not exists", async () => {
    const { authCookie } = await createAuthedUserContext();
    const invalidProjectId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/projects/${invalidProjectId}/details`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Project not found" });
  });

  it("retuns project-details", async () => {
    const { authCookie, workspaceId, userId } = await createAuthedUserContext();
    const projectId = new mongoose.Types.ObjectId();
    const invitedUser = await createUser({
      workspaceId,
      name: "Invited User",
    });

    const project = await createProject({
      _id: projectId,
      workspaceId,
      ownerId: userId.toString(),
      title: "Project Details",
      description: "Project details description",
      priority: "high",
      projectStatus: "in_progress",
      dueDate: "2026-07-15",
      invitedUserIds: [invitedUser._id],
    });

    await createTask({
      workspaceId,
      projectId,
      taskStatus: "done",
    });
    await createTask({
      workspaceId,
      projectId,
      taskStatus: "pending",
    });

    const response = await request(app)
      .get(`/projects/${projectId}/details`)
      .set("Cookie", authCookie);

    if (!project.updatedAt) {
      throw new Error("Expected project.updatedAt to be defined");
    }

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      id: projectId.toString(),
      title: "Project Details",
      description: "Project details description",
      priority: "high",
      projectStatus: "in_progress",
      dueDate: project.dueDate.toISOString(),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      invitedUserIds: [invitedUser._id.toString()],
      invitedUsers: [
        {
          id: invitedUser._id.toString(),
        },
      ],
      progressPercent: 50,
    });
  });
});
