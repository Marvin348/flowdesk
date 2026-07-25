import app from "@/app";
import { NotificationModel } from "@/features/notification/models/notification.model";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import request from "supertest";
import {
  createAuthedUserContext,
  createProject,
  createTask,
  createUser,
} from "@/test/helpers/testFactories";
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

describe("GET /notifications", () => {
  it("returns 401 if the user is not authenticated", async () => {
    const response = await request(app).get("/notifications");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Not authenticated" });
  });

  it("returns 400 if the query is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .get("/notifications")
      .query({ status: "invalid-status" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid query" });
  });

  it("returns an empty paginated list when the user has no notifications", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .get("/notifications")
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      items: [],
      unreadCount: 0,
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
      },
    });
  });

  it("returns paginated notifications for the authenticated user", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();
    const actor = await createUser({ workspaceId });
    const otherRecipient = await createUser({ workspaceId });
    const otherWorkspaceId = new mongoose.Types.ObjectId();

    const project = await createProject({
      workspaceId,
      title: "Notification Project",
    });
    const task = await createTask({
      workspaceId,
      projectId: project._id,
      title: "Notification Task",
    });
    const matchingProjectNotificationId = new mongoose.Types.ObjectId();
    const matchingTaskNotificationId = new mongoose.Types.ObjectId();

    await NotificationModel.create([
      {
        _id: matchingProjectNotificationId,
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "project_assigned",
        entityType: "project",
        entityId: project._id,
        isRead: false,
      },
      {
        _id: matchingTaskNotificationId,
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "task_assigned",
        entityType: "task",
        entityId: task._id,
        isRead: true,
        readAt: new Date("2026-07-20T10:00:00.000Z"),
      },
      {
        workspaceId,
        actorId: actor._id,
        recipientId: otherRecipient._id,
        type: "project_assigned",
        entityType: "project",
        entityId: project._id,
        isRead: false,
      },
      {
        workspaceId: otherWorkspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "project_assigned",
        entityType: "project",
        entityId: project._id,
        isRead: false,
      },
    ]);

    const response = await request(app)
      .get("/notifications")
      .query({ page: 1, limit: 10 })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.data.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalItems: 2,
    });
    expect(response.body.data.unreadCount).toBe(1);
    expect(response.body.data.items).toHaveLength(2);

    expect(response.body.data.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: matchingProjectNotificationId.toString(),
          type: "project_assigned",
          entityType: "project",
          actor: {
            id: actor._id.toString(),
            name: actor.name,
          },
          project: {
            id: project._id.toString(),
            title: "Notification Project",
          },
          isRead: false,
          readAt: "",
          createdAt: expect.any(String),
        }),
        expect.objectContaining({
          id: matchingTaskNotificationId.toString(),
          type: "task_assigned",
          entityType: "task",
          actor: {
            id: actor._id.toString(),
            name: actor.name,
          },
          task: {
            id: task._id.toString(),
            title: "Notification Task",
            projectId: project._id.toString(),
          },
          isRead: true,
          readAt: new Date("2026-07-20T10:00:00.000Z").toISOString(),
          createdAt: expect.any(String),
        }),
      ]),
    );
  });

  it("returns only unread notifications when status is unread", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();
    const actor = await createUser({ workspaceId });

    const unreadNotificationId = new mongoose.Types.ObjectId();
    const readNotificationId = new mongoose.Types.ObjectId();

    await NotificationModel.create([
      {
        _id: unreadNotificationId,
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "project_assigned",
        entityType: "project",
        entityId: new mongoose.Types.ObjectId(),
        isRead: false,
      },
      {
        _id: readNotificationId,
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "role_changed",
        entityType: "user",
        entityId: userId,
        metadata: {
          previousRole: "member",
          currentRole: "manager",
        },
        isRead: true,
        readAt: new Date("2026-07-20T10:00:00.000Z"),
      },
    ]);

    const response = await request(app)
      .get("/notifications")
      .query({ status: "unread" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.data.unreadCount).toBe(1);
    expect(response.body.data.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalItems: 1,
    });
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0]).toMatchObject({
      id: unreadNotificationId.toString(),
      type: "project_assigned",
      entityType: "project",
      actor: {
        id: actor._id.toString(),
        name: actor.name,
      },
      isRead: false,
    });
  });

  it("applies page and limit pagination", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();
    const actor = await createUser({ workspaceId });

    await NotificationModel.create([
      {
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "project_assigned",
        entityType: "project",
        entityId: new mongoose.Types.ObjectId(),
        isRead: false,
      },
      {
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "project_assigned",
        entityType: "project",
        entityId: new mongoose.Types.ObjectId(),
        isRead: false,
      },
      {
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "project_assigned",
        entityType: "project",
        entityId: new mongoose.Types.ObjectId(),
        isRead: true,
      },
    ]);

    const response = await request(app)
      .get("/notifications")
      .query({ page: 2, limit: 1 })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.unreadCount).toBe(2);
    expect(response.body.data.pagination).toEqual({
      currentPage: 2,
      totalPages: 3,
      totalItems: 3,
    });
  });
});
