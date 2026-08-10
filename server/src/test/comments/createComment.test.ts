import app from "@/app";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import request from "supertest";
import {
  createAuthedUserContext,
  createComment,
  createProject,
  createTask,
  createUser,
} from "@/test/helpers/testFactories";
import { ActivityModel } from "@/features/activity/models/activity.model";
import { CommentModel } from "@/features/comments/models/comment.model";
import mongoose from "mongoose";
import { notificationQueue } from "@/queues/notificationQueue";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterEach(() => {
  vi.restoreAllMocks();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("POST /comments", () => {
  it("returns 401 if the user is not authenticated", async () => {
    const response = await request(app).post("/comments").send({
      taskId: new mongoose.Types.ObjectId().toString(),
      message: "Unauthenticated comment",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Not authenticated" });
  });

  it("returns 400 if the request body is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .post("/comments")
      .set("Cookie", authCookie)
      .send({
        taskId: "invalid-task-id",
        message: "Invalid body comment",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid request body" });
  });

  it("returns 404 if the task does not exist", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .post("/comments")
      .set("Cookie", authCookie)
      .send({
        taskId: new mongoose.Types.ObjectId().toString(),
        message: "Missing task comment",
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Task not found" });
  });

  it("returns 404 if the parent comment does not exist on the task", async () => {
    const { authCookie, workspaceId, userId } = await createAuthedUserContext();
    const projectId = new mongoose.Types.ObjectId();

    await createProject({
      _id: projectId,
      workspaceId,
      ownerId: userId.toString(),
    });

    const task = await createTask({
      workspaceId,
      projectId,
    });

    const response = await request(app)
      .post("/comments")
      .set("Cookie", authCookie)
      .send({
        taskId: task._id.toString(),
        message: "Reply without parent",
        parentCommentId: new mongoose.Types.ObjectId().toString(),
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Parent comment not found" });
  });

  it("creates a root comment", async () => {
    const { authCookie, workspaceId, userId } = await createAuthedUserContext();
    const projectId = new mongoose.Types.ObjectId();

    await createProject({
      _id: projectId,
      workspaceId,
      ownerId: userId.toString(),
    });

    const task = await createTask({
      workspaceId,
      projectId,
      title: "Comment task",
    });

    const response = await request(app)
      .post("/comments")
      .set("Cookie", authCookie)
      .send({
        taskId: task._id.toString(),
        message: "Created root comment",
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual({
      id: expect.any(String),
      taskId: task._id.toString(),
      userId: userId.toString(),
      message: "Created root comment",
      createdAt: expect.any(String),
    });

    const persistedComment = await CommentModel.findById(
      response.body.data.id,
    ).lean();

    expect(persistedComment).toMatchObject({
      workspaceId,
      taskId: task._id,
      userId: new mongoose.Types.ObjectId(userId),
      message: "Created root comment",
    });

    const activity = await ActivityModel.findOne({
      workspaceId,
      type: "comment.created",
      entityType: "comment",
      entityId: response.body.data.id,
    }).lean();

    expect(activity).toMatchObject({
      actorId: new mongoose.Types.ObjectId(userId),
      metadata: {
        taskId: task._id.toString(),
        taskTitle: "Comment task",
        projectId: projectId.toString(),
        commentMessage: "Created root comment",
      },
    });
  });

  it("creates a reply comment", async () => {
    const { authCookie, workspaceId, userId } = await createAuthedUserContext();
    const parentAuthor = await createUser({ workspaceId });
    const projectId = new mongoose.Types.ObjectId();

    await createProject({
      _id: projectId,
      workspaceId,
      ownerId: userId.toString(),
    });

    const task = await createTask({
      workspaceId,
      projectId,
      title: "Reply task",
    });

    const parentComment = await createComment({
      workspaceId,
      taskId: task._id,
      userId: parentAuthor._id,
      message: "Parent comment",
    });

    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockClear();
    queueAddMock.mockResolvedValue(undefined as never);

    const response = await request(app)
      .post("/comments")
      .set("Cookie", authCookie)
      .send({
        taskId: task._id.toString(),
        message: "Created reply comment",
        parentCommentId: parentComment._id.toString(),
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual({
      id: expect.any(String),
      taskId: task._id.toString(),
      userId: userId.toString(),
      message: "Created reply comment",
      createdAt: expect.any(String),
      parentCommentId: parentComment._id.toString(),
    });

    expect(queueAddMock).toHaveBeenCalledOnce();
    expect(queueAddMock).toHaveBeenCalledWith("comment-reply", {
      workspaceId: workspaceId.toString(),
      actorId: userId.toString(),
      recipientId: parentAuthor._id.toString(),
      commentId: response.body.data.id,
      projectId: projectId.toString(),
    });
  });
});
