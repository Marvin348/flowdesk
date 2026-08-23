import app from "@/app";
import { NotificationModel } from "@/features/notification/models/notification.model";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
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

  it("returns 400 if filterType is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .get("/notifications")
      .query({ filterType: "invalid-filter" })
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
      inboxCount: 0,
      archiveCount: 0,
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
    const otherWorkspaceProjectId = new mongoose.Types.ObjectId();
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
        entityId: otherWorkspaceProjectId,
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
    expect(response.body.data.inboxCount).toBe(2);
    expect(response.body.data.archiveCount).toBe(0);
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
    expect(response.body.data.inboxCount).toBe(2);
    expect(response.body.data.archiveCount).toBe(0);
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

  it("filters inbox notifications by comments filterType", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();
    const actor = await createUser({ workspaceId });
    const mentionNotificationId = new mongoose.Types.ObjectId();
    const replyNotificationId = new mongoose.Types.ObjectId();

    await NotificationModel.create([
      {
        _id: mentionNotificationId,
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "comment_mention",
        entityType: "comment",
        entityId: new mongoose.Types.ObjectId(),
        isRead: false,
      },
      {
        _id: replyNotificationId,
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "comment_reply",
        entityType: "comment",
        entityId: new mongoose.Types.ObjectId(),
        isRead: false,
      },
      {
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "comment_reply",
        entityType: "comment",
        entityId: new mongoose.Types.ObjectId(),
        archivedAt: new Date("2026-07-21T10:00:00.000Z"),
        isRead: true,
      },
      {
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "task_overdue",
        entityType: "task",
        entityId: new mongoose.Types.ObjectId(),
        isRead: false,
      },
      {
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
        isRead: false,
      },
    ]);

    const response = await request(app)
      .get("/notifications")
      .query({ filterType: "comments" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(
      response.body.data.items.map((item: { id: string }) => item.id),
    ).toEqual(
      expect.arrayContaining([
        mentionNotificationId.toString(),
        replyNotificationId.toString(),
      ]),
    );
    expect(response.body.data.items).toHaveLength(2);
    expect(response.body.data.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "comment_mention" }),
        expect.objectContaining({ type: "comment_reply" }),
      ]),
    );
    expect(response.body.data.unreadCount).toBe(2);
    expect(response.body.data.inboxCount).toBe(4);
    expect(response.body.data.archiveCount).toBe(1);
    expect(response.body.data.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalItems: 2,
    });
  });

  it("filters archived notifications by deadline filterType", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();
    const actor = await createUser({ workspaceId });
    const dueSoonNotificationId = new mongoose.Types.ObjectId();
    const overdueNotificationId = new mongoose.Types.ObjectId();
    const projectDueSoonNotificationId = new mongoose.Types.ObjectId();

    await NotificationModel.create([
      {
        _id: dueSoonNotificationId,
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "task_due_soon",
        entityType: "task",
        entityId: new mongoose.Types.ObjectId(),
        archivedAt: new Date("2026-07-21T10:00:00.000Z"),
        isRead: false,
      },
      {
        _id: overdueNotificationId,
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "task_overdue",
        entityType: "task",
        entityId: new mongoose.Types.ObjectId(),
        archivedAt: new Date("2026-07-21T10:00:00.000Z"),
        isRead: true,
      },
      {
        _id: projectDueSoonNotificationId,
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "project_due_soon",
        entityType: "project",
        entityId: new mongoose.Types.ObjectId(),
        archivedAt: new Date("2026-07-21T10:00:00.000Z"),
        isRead: false,
      },
      {
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "comment_mention",
        entityType: "comment",
        entityId: new mongoose.Types.ObjectId(),
        archivedAt: new Date("2026-07-21T10:00:00.000Z"),
        isRead: false,
      },
      {
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "task_overdue",
        entityType: "task",
        entityId: new mongoose.Types.ObjectId(),
        isRead: false,
      },
    ]);

    const response = await request(app)
      .get("/notifications")
      .query({ view: "archive", filterType: "deadline" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(
      response.body.data.items.map((item: { id: string }) => item.id),
    ).toEqual(
      expect.arrayContaining([
        dueSoonNotificationId.toString(),
        overdueNotificationId.toString(),
        projectDueSoonNotificationId.toString(),
      ]),
    );
    expect(response.body.data.items).toHaveLength(3);
    expect(response.body.data.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "task_due_soon" }),
        expect.objectContaining({ type: "task_overdue" }),
        expect.objectContaining({ type: "project_due_soon" }),
      ]),
    );
    expect(response.body.data.unreadCount).toBe(2);
    expect(response.body.data.inboxCount).toBe(1);
    expect(response.body.data.archiveCount).toBe(4);
    expect(response.body.data.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalItems: 3,
    });
  });

  it("filters task notifications by tasks filterType", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();
    const actor = await createUser({ workspaceId });
    const taskAssignedNotificationId = new mongoose.Types.ObjectId();
    const taskDueSoonNotificationId = new mongoose.Types.ObjectId();
    const taskOverdueNotificationId = new mongoose.Types.ObjectId();

    await NotificationModel.create([
      {
        _id: taskAssignedNotificationId,
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "task_assigned",
        entityType: "task",
        entityId: new mongoose.Types.ObjectId(),
      },
      {
        _id: taskDueSoonNotificationId,
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "task_due_soon",
        entityType: "task",
        entityId: new mongoose.Types.ObjectId(),
      },
      {
        _id: taskOverdueNotificationId,
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "task_overdue",
        entityType: "task",
        entityId: new mongoose.Types.ObjectId(),
      },
      {
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "project_due_soon",
        entityType: "project",
        entityId: new mongoose.Types.ObjectId(),
      },
      {
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "comment_reply",
        entityType: "comment",
        entityId: new mongoose.Types.ObjectId(),
      },
    ]);

    const response = await request(app)
      .get("/notifications")
      .query({ filterType: "tasks" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(
      response.body.data.items.map((item: { id: string }) => item.id),
    ).toEqual([taskAssignedNotificationId.toString()]);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0]).toMatchObject({
      type: "task_assigned",
    });
    
    expect(response.body.data.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalItems: 1,
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
    expect(response.body.data.inboxCount).toBe(3);
    expect(response.body.data.archiveCount).toBe(0);
    expect(response.body.data.pagination).toEqual({
      currentPage: 2,
      totalPages: 3,
      totalItems: 3,
    });
  });

  it("returns inbox notifications by default and excludes archived notifications", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();
    const actor = await createUser({ workspaceId });
    const inboxNotificationId = new mongoose.Types.ObjectId();
    const archivedNotificationId = new mongoose.Types.ObjectId();

    await NotificationModel.create([
      {
        _id: inboxNotificationId,
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "project_assigned",
        entityType: "project",
        entityId: new mongoose.Types.ObjectId(),
        archivedAt: null,
      },
      {
        _id: archivedNotificationId,
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "role_changed",
        entityType: "user",
        entityId: userId,
        archivedAt: new Date("2026-07-21T10:00:00.000Z"),
      },
    ]);

    const response = await request(app)
      .get("/notifications")
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0]).toMatchObject({
      id: inboxNotificationId.toString(),
      isArchived: false,
    });
    expect(response.body.data.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalItems: 1,
    });
    expect(response.body.data.inboxCount).toBe(1);
    expect(response.body.data.archiveCount).toBe(1);
  });

  it("returns only archived notifications when view is archive", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();
    const actor = await createUser({ workspaceId });
    const inboxNotificationId = new mongoose.Types.ObjectId();
    const archivedNotificationId = new mongoose.Types.ObjectId();

    await NotificationModel.create([
      {
        _id: inboxNotificationId,
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "project_assigned",
        entityType: "project",
        entityId: new mongoose.Types.ObjectId(),
        archivedAt: null,
      },
      {
        _id: archivedNotificationId,
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "role_changed",
        entityType: "user",
        entityId: userId,
        archivedAt: new Date("2026-07-21T10:00:00.000Z"),
      },
    ]);

    const response = await request(app)
      .get("/notifications")
      .query({ view: "archive" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0]).toMatchObject({
      id: archivedNotificationId.toString(),
      isArchived: true,
    });
    expect(response.body.data.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalItems: 1,
    });
    expect(response.body.data.inboxCount).toBe(1);
    expect(response.body.data.archiveCount).toBe(1);
  });

  it("sorts pinned inbox notifications before newer unpinned notifications", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();
    const actor = await createUser({ workspaceId });
    const pinnedNotificationId = new mongoose.Types.ObjectId();
    const newestNotificationId = new mongoose.Types.ObjectId();

    await NotificationModel.create([
      {
        _id: newestNotificationId,
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "project_assigned",
        entityType: "project",
        entityId: new mongoose.Types.ObjectId(),
        pinnedAt: null,
        createdAt: new Date("2026-07-22T10:00:00.000Z"),
      },
      {
        _id: pinnedNotificationId,
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "role_changed",
        entityType: "user",
        entityId: userId,
        pinnedAt: new Date("2026-07-20T10:00:00.000Z"),
        createdAt: new Date("2026-07-20T10:00:00.000Z"),
      },
    ]);

    const response = await request(app)
      .get("/notifications")
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(
      response.body.data.items.map((item: { id: string }) => item.id),
    ).toEqual([
      pinnedNotificationId.toString(),
      newestNotificationId.toString(),
    ]);
    expect(response.body.data.items[0]).toMatchObject({
      id: pinnedNotificationId.toString(),
      isPinned: true,
    });
  });

  it("sorts archived notifications by createdAt instead of pinnedAt", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();
    const actor = await createUser({ workspaceId });
    const pinnedOlderArchivedId = new mongoose.Types.ObjectId();
    const newestArchivedId = new mongoose.Types.ObjectId();

    await NotificationModel.create([
      {
        _id: pinnedOlderArchivedId,
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "role_changed",
        entityType: "user",
        entityId: userId,
        pinnedAt: new Date("2026-07-20T10:00:00.000Z"),
        archivedAt: new Date("2026-07-23T10:00:00.000Z"),
        createdAt: new Date("2026-07-20T10:00:00.000Z"),
      },
      {
        _id: newestArchivedId,
        workspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "project_assigned",
        entityType: "project",
        entityId: new mongoose.Types.ObjectId(),
        pinnedAt: null,
        archivedAt: new Date("2026-07-23T10:00:00.000Z"),
        createdAt: new Date("2026-07-22T10:00:00.000Z"),
      },
    ]);

    const response = await request(app)
      .get("/notifications")
      .query({ view: "archive" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(
      response.body.data.items.map((item: { id: string }) => item.id),
    ).toEqual([newestArchivedId.toString(), pinnedOlderArchivedId.toString()]);
    expect(response.body.data.inboxCount).toBe(0);
    expect(response.body.data.archiveCount).toBe(2);
  });
});
