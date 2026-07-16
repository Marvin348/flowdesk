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

describe("GET /projects/:projectId/comments", () => {
  it("returns 400 if the projectId is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .get(`/projects/invalid-id/comments`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid projectId" });
  });

  it("returns 400 if the query is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();
    const projectId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/projects/${projectId}/comments`)
      .query({ commentsSort: "invalid-sort" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid query" });
  });

  it("returns 404 if the project not exists", async () => {
    const { authCookie } = await createAuthedUserContext();
    const invalidProjectId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/projects/${invalidProjectId}/comments`)
      .query({ commentsSort: "newest" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Project not found" });
  });

  it("returns project comments", async () => {
    const { authCookie, workspaceId, userId } = await createAuthedUserContext();
    const projectId = new mongoose.Types.ObjectId();
    const otherProjectId = new mongoose.Types.ObjectId();

    const commenter = await createUser({
      workspaceId,
      name: "Comment User",
      avatarStorageKey: "avatars/comment-user.png",
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

    const firstTask = await createTask({
      workspaceId,
      projectId,
      title: "First task",
    });

    const secondTask = await createTask({
      workspaceId,
      projectId,
      title: "Second task",
    });

    const otherTask = await createTask({
      workspaceId,
      projectId: otherProjectId,
      title: "Other project task",
    });

    const oldestComment = await createComment({
      workspaceId,
      taskId: firstTask._id,
      userId: commenter._id,
      message: "Oldest comment",
    });

    await CommentModel.collection.updateOne(
      { _id: oldestComment._id },
      { $set: { createdAt: new Date("2026-07-10T10:00:00.000Z") } },
    );

    const secondComment = await createComment({
      workspaceId,
      taskId: secondTask._id,
      userId: commenter._id,
      message: "Second comment",
    });

    await CommentModel.collection.updateOne(
      { _id: secondComment._id },
      { $set: { createdAt: new Date("2026-07-11T10:00:00.000Z") } },
    );

    const newestComment = await createComment({
      workspaceId,
      taskId: firstTask._id,
      userId: commenter._id,
      message: "Newest comment",
    });

    await CommentModel.collection.updateOne(
      { _id: newestComment._id },
      { $set: { createdAt: new Date("2026-07-12T10:00:00.000Z") } },
    );

    await createComment({
      workspaceId,
      taskId: otherTask._id,
      userId: commenter._id,
      message: "Other project comment",
    });

    const response = await request(app)
      .get(`/projects/${projectId}/comments`)
      .query({ commentsSort: "oldest", limit: 2 })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      comments: [
        {
          id: oldestComment._id.toString(),
          message: "Oldest comment",
          createdAt: "2026-07-10T10:00:00.000Z",
          task: {
            id: firstTask._id.toString(),
            title: "First task",
          },
          user: {
            id: commenter._id.toString(),
            name: "Comment User",
            avatarUrl: "https://public-r2.test/avatars/comment-user.png",
          },
        },
        {
          id: secondComment._id.toString(),
          message: "Second comment",
          createdAt: "2026-07-11T10:00:00.000Z",
          task: {
            id: secondTask._id.toString(),
            title: "Second task",
          },
          user: {
            id: commenter._id.toString(),
            name: "Comment User",
            avatarUrl: "https://public-r2.test/avatars/comment-user.png",
          },
        },
      ],
      taskOptions: expect.arrayContaining([
        {
          taskId: firstTask._id.toString(),
          taskTitle: "First task",
        },
        {
          taskId: secondTask._id.toString(),
          taskTitle: "Second task",
        },
      ]),
      totalItems: 3,
      hasMore: true,
    });
    expect(response.body.data.taskOptions).toHaveLength(2);
    expect(response.body.data.comments).not.toContainEqual(
      expect.objectContaining({
        id: newestComment._id.toString(),
      }),
    );
  });
});
