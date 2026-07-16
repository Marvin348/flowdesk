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

describe("GET /projects/:projectId/workload", () => {
  it("returns 400 if the projectId is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .get(`/projects/invalid-id/workload`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid projectId" });
  });

  it("returns 400 if the query is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();
    const projectId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/projects/${projectId}/workload`)
      .query({ workloadSort: "invalid-sort" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid query" });
  });

  it("returns 404 if the project not exists", async () => {
    const { authCookie } = await createAuthedUserContext();
    const invalidProjectId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/projects/${invalidProjectId}/workload`)
      .query({ workloadSort: "name_asc" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Project not found" });
  });

  it("returns project workload", async () => {
    const { authCookie, workspaceId, userId } = await createAuthedUserContext();
    const projectId = new mongoose.Types.ObjectId();
    const otherProjectId = new mongoose.Types.ObjectId();

    const alice = await createUser({
      workspaceId,
      name: "Alice",
      jobTitle: "Designer",
    });

    const bob = await createUser({
      workspaceId,
      name: "Bob",
      jobTitle: "Developer",
      avatarStorageKey: "avatars/bob.png",
    });

    const charlie = await createUser({
      workspaceId,
      name: "Charlie",
    });

    await createProject({
      _id: projectId,
      workspaceId,
      ownerId: userId.toString(),
    });

    await createProject({
      _id: otherProjectId,
      workspaceId,
      ownerId: userId.toString(),
    });

    await createTask({
      workspaceId,
      projectId,
      title: "Alice done task",
      taskStatus: "done",
      collaboratorIds: [alice._id],
    });

    await createTask({
      workspaceId,
      projectId,
      title: "Bob pending task",
      taskStatus: "pending",
      collaboratorIds: [bob._id],
    });

    await createTask({
      workspaceId,
      projectId,
      title: "Bob done task",
      taskStatus: "done",
      collaboratorIds: [bob._id],
    });

    await createTask({
      workspaceId,
      projectId: otherProjectId,
      title: "Other project task",
      taskStatus: "pending",
      collaboratorIds: [charlie._id],
    });

    const response = await request(app)
      .get(`/projects/${projectId}/workload`)
      .query({ workloadSort: "name_desc", page: 1, limit: 1 })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      items: [
        {
          totalTasks: 2,
          user: {
            id: bob._id.toString(),
            name: "Bob",
            avatarUrl: "https://public-r2.test/avatars/bob.png",
            jobTitle: "Developer",
          },
          byStatusCounts: {
            pending: 1,
            in_progress: 0,
            done: 1,
          },
          openCount: 1,
          progressPercent: 50,
        },
      ],
      pagination: {
        totalPages: 2,
        currentPage: 1,
      },
    });
  });
});
