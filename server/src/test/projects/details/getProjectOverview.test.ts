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
  createComment,
  createProject,
  createTask,
  createUser,
} from "@/test/helpers/testFactories.js";
import { CommentModel } from "@/features/comments/models/comment.model.js";
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

describe("GET /projects/:projectId/overview", () => {
  it("returns 400 if the projectId is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .get(`/projects/invalid-id/overview`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid projectId" });
  });

  it("returns 404 if the project not exists", async () => {
    const { authCookie } = await createAuthedUserContext();
    const invalidProjectId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/projects/${invalidProjectId}/overview`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Project not found" });
  });

  it("returns project overview", async () => {
    const { authCookie, workspaceId, userId } = await createAuthedUserContext();
    const projectId = new mongoose.Types.ObjectId();
    const otherProjectId = new mongoose.Types.ObjectId();

    const alice = await createUser({
      workspaceId,
      name: "Alice",
      jobTitle: "Designer",
      avatarStorageKey: "avatars/alice.png",
    });

    const bob = await createUser({
      workspaceId,
      name: "Bob",
      jobTitle: "Developer",
    });

    const outsider = await createUser({
      workspaceId,
      name: "Outsider",
    });

    await createProject({
      _id: projectId,
      workspaceId,
      ownerId: userId.toString(),
      invitedUserIds: [alice._id, bob._id],
    });

    await createProject({
      _id: otherProjectId,
      workspaceId,
      ownerId: userId.toString(),
      invitedUserIds: [outsider._id],
    });

    const openTask = await createTask({
      workspaceId,
      projectId,
      title: "Open overview task",
      dueDate: "2026-07-20",
      taskStatus: "pending",
      description: "Needs review",
      collaboratorIds: [alice._id, bob._id],
    });

    await createTask({
      workspaceId,
      projectId,
      title: "In progress overview task",
      dueDate: "2026-07-21",
      taskStatus: "in_progress",
      collaboratorIds: [bob._id],
    });

    const doneTask = await createTask({
      workspaceId,
      projectId,
      title: "Done overview task",
      taskStatus: "done",
      collaboratorIds: [alice._id],
    });

    const otherProjectTask = await createTask({
      workspaceId,
      projectId: otherProjectId,
      title: "Other project task",
      taskStatus: "pending",
      collaboratorIds: [outsider._id],
    });

    const olderComment = await createComment({
      workspaceId,
      taskId: openTask._id,
      userId: alice._id,
      message: "Older overview comment",
    });

    await CommentModel.collection.updateOne(
      { _id: olderComment._id },
      { $set: { createdAt: new Date("2026-07-10T10:00:00.000Z") } },
    );

    const newerComment = await createComment({
      workspaceId,
      taskId: doneTask._id,
      userId: bob._id,
      message: "Newer overview comment",
    });

    await CommentModel.collection.updateOne(
      { _id: newerComment._id },
      { $set: { createdAt: new Date("2026-07-11T10:00:00.000Z") } },
    );

    await createComment({
      workspaceId,
      taskId: otherProjectTask._id,
      userId: outsider._id,
      message: "Other project comment",
    });

    const response = await request(app)
      .get(`/projects/${projectId}/overview`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      collaborators: [
        {
          id: alice._id.toString(),
          name: "Alice",
          avatarUrl: "https://public-r2.test/avatars/alice.png",
          jobTitle: "Designer",
        },
        {
          id: bob._id.toString(),
          name: "Bob",
          jobTitle: "Developer",
        },
      ],
      openTasks: [
        {
          id: openTask._id.toString(),
          title: "Open overview task",
          dueDate: new Date("2026-07-20").toISOString(),
          taskStatus: "pending",
          description: "Needs review",
          collaborators: [
            {
              id: alice._id.toString(),
              name: "Alice",
              avatarUrl: "https://public-r2.test/avatars/alice.png",
              jobTitle: "Designer",
            },
            {
              id: bob._id.toString(),
              name: "Bob",
              jobTitle: "Developer",
            },
          ],
        },
        {
          id: expect.any(String),
          title: "In progress overview task",
          dueDate: new Date("2026-07-21").toISOString(),
          taskStatus: "in_progress",
          collaborators: [
            {
              id: bob._id.toString(),
              name: "Bob",
              jobTitle: "Developer",
            },
          ],
        },
      ],
      recentComments: [
        {
          id: newerComment._id.toString(),
          message: "Newer overview comment",
          createdAt: "2026-07-11T10:00:00.000Z",
          user: {
            id: bob._id.toString(),
            name: "Bob",
            jobTitle: "Developer",
          },
        },
        {
          id: olderComment._id.toString(),
          message: "Older overview comment",
          createdAt: "2026-07-10T10:00:00.000Z",
          user: {
            id: alice._id.toString(),
            name: "Alice",
            avatarUrl: "https://public-r2.test/avatars/alice.png",
            jobTitle: "Designer",
          },
        },
      ],
      progress: {
        total: 3,
        completed: 1,
        progressPercent: 33,
      },
      workload: [
        {
          totalTasks: 2,
          user: {
            id: bob._id.toString(),
            name: "Bob",
            jobTitle: "Developer",
          },
          byStatusCounts: {
            pending: 1,
            in_progress: 1,
            done: 0,
          },
          openCount: 2,
          progressPercent: 0,
        },
        {
          totalTasks: 2,
          user: {
            id: alice._id.toString(),
            name: "Alice",
            avatarUrl: "https://public-r2.test/avatars/alice.png",
            jobTitle: "Designer",
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
    });
  });
});
