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

describe("PATCH /notifications/read-all", () => {
  it("marks all unread notifications for the authenticated user as read", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();
    const actor = await createUser({ workspaceId });
    const otherRecipient = await createUser({ workspaceId });
    const otherWorkspaceId = new mongoose.Types.ObjectId();
    const project = await createProject({ workspaceId });

    const readAt = new Date("2026-07-20T10:00:00.000Z");

    const [firstUnreadNotification, secondUnreadNotification, readNotification] =
      await NotificationModel.create([
        {
          workspaceId,
          actorId: actor._id,
          recipientId: userId,
          type: "project_assigned",
          entityType: "project",
          entityId: project._id,
          isRead: false,
        },
        {
          workspaceId,
          actorId: actor._id,
          recipientId: userId,
          type: "project_due_soon",
          entityType: "project",
          entityId: project._id,
          isRead: false,
        },
        {
          workspaceId,
          actorId: actor._id,
          recipientId: userId,
          type: "project_assigned",
          entityType: "project",
          entityId: project._id,
          isRead: true,
          readAt,
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
      .patch("/notifications/read-all")
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Notifications all marked as read",
    });

    const ownNotifications = await NotificationModel.find({
      _id: {
        $in: [firstUnreadNotification._id, secondUnreadNotification._id],
      },
    });

    expect(ownNotifications).toHaveLength(2);
    ownNotifications.forEach((notification) => {
      expect(notification.isRead).toBe(true);
      expect(notification.readAt).toBeInstanceOf(Date);
    });

    const unchangedReadNotification = await NotificationModel.findById(
      readNotification._id,
    );

    expect(unchangedReadNotification?.isRead).toBe(true);
    expect(unchangedReadNotification?.readAt?.toISOString()).toBe(
      readAt.toISOString(),
    );

    const untouchedNotificationsCount = await NotificationModel.countDocuments({
      isRead: false,
    });

    expect(untouchedNotificationsCount).toBe(2);
  });
});
