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

describe("GET /comments", () => {
  it("returns 401 if the user is not authenticated", async () => {
    const response = await request(app).get("/comments");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Not authenticated" });
  });

  it("returns comments for tasks in the authenticated workspace projects", async () => {
    const { authCookie, workspaceId, userId } = await createAuthedUserContext();
    const otherContext = await createAuthedUserContext();
    const projectId = new mongoose.Types.ObjectId();
    const secondProjectId = new mongoose.Types.ObjectId();
    const otherWorkspaceProjectId = new mongoose.Types.ObjectId();

    await createProject({
      _id: projectId,
      workspaceId,
      ownerId: userId.toString(),
    });

    await createProject({
      _id: secondProjectId,
      workspaceId,
      ownerId: userId.toString(),
    });

    await createProject({
      _id: otherWorkspaceProjectId,
      workspaceId: otherContext.workspaceId,
      ownerId: otherContext.userId.toString(),
    });

    const firstTask = await createTask({
      workspaceId,
      projectId,
      title: "First comment task",
    });

    const secondTask = await createTask({
      workspaceId,
      projectId: secondProjectId,
      title: "Second comment task",
    });

    const otherWorkspaceTask = await createTask({
      workspaceId: otherContext.workspaceId,
      projectId: otherWorkspaceProjectId,
      title: "Other workspace task",
    });

    const firstComment = await createComment({
      workspaceId,
      taskId: firstTask._id,
      userId,
      message: "First workspace comment",
    });

    const secondComment = await createComment({
      workspaceId,
      taskId: secondTask._id,
      userId,
      message: "Second workspace comment",
      parentCommentId: firstComment._id.toString(),
    });

    await createComment({
      workspaceId: otherContext.workspaceId,
      taskId: otherWorkspaceTask._id,
      userId: otherContext.userId,
      message: "Other workspace comment",
    });

    const response = await request(app)
      .get("/comments")
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: firstComment._id.toString(),
          workspaceId: workspaceId.toString(),
          taskId: firstTask._id.toString(),
          userId: userId.toString(),
          message: "First workspace comment",
        }),
        expect.objectContaining({
          _id: secondComment._id.toString(),
          workspaceId: workspaceId.toString(),
          taskId: secondTask._id.toString(),
          userId: userId.toString(),
          message: "Second workspace comment",
          parentCommentId: firstComment._id.toString(),
        }),
      ]),
    );
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data).not.toContainEqual(
      expect.objectContaining({
        message: "Other workspace comment",
      }),
    );
  });
});
