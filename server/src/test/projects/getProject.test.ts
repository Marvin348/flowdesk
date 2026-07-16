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
  createWorkspace,
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

describe("GET /projects/:id", () => {
  it("returns 400 if the projectId is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .get("/projects/invalid-project-id")
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid projectId" });
  });

  it("returns 404 if the project does not exist", async () => {
    const { authCookie } = await createAuthedUserContext();
    const missingProjectId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/projects/${missingProjectId}`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Project not found" });
  });

  it("returns 404 if the project belongs to another workspace", async () => {
    const { authCookie } = await createAuthedUserContext();
    const otherWorkspace = await createWorkspace({
      name: "Other Workspace",
    });
    const otherProject = await createProject({
      workspaceId: otherWorkspace._id,
      title: "Other Workspace Project",
    });

    const response = await request(app)
      .get(`/projects/${otherProject._id}`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Project not found" });
  });

  it("returns the project from the authenticated user's workspace", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();
    const project = await createProject({
      workspaceId,
      title: "Launch Project",
      description: "Ship the first release",
      ownerId: userId.toString(),
      priority: "medium",
      projectStatus: "pending",
      dueDate: "2026-08-01",
    });

    const response = await request(app)
      .get(`/projects/${project._id}`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      id: project._id.toString(),
      title: "Launch Project",
      description: "Ship the first release",
      ownerId: userId.toString(),
      priority: "medium",
      projectStatus: "pending",
      dueDate: project.dueDate.toISOString(),
      invitedUserIds: [],
    });
    expect(response.body.data.createdAt).toEqual(expect.any(String));
    expect(response.body.data.updatedAt).toEqual(expect.any(String));
  });
});
