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

describe("PATCH /notifications/:notificationId/read", () => {
  it("returns 400 if the notificationId is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .patch(`/notifications/${"invalid"}/read`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid notificationId" });
  });

  it("returns 404 if the notification was not found", async () => {
    const { authCookie } = await createAuthedUserContext();
    const invalidNotificationId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .patch(`/notifications/${invalidNotificationId}/read`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Notification not found" });
  });

  it("updates notification as read", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();
    const actor = await createUser({ workspaceId });
    const project = await createProject({ workspaceId });

    const notification = await NotificationModel.create({
      workspaceId,
      actorId: actor._id,
      recipientId: userId,
      type: "project_assigned",
      entityType: "project",
      entityId: project._id,
      isRead: false,
    });

    const response = await request(app)
      .patch(`/notifications/${notification._id}/read`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Notification marked as read" });

    const updatedNotification = await NotificationModel.findById(
      notification._id,
    );

    expect(updatedNotification).not.toBeNull();
    expect(updatedNotification?.isRead).toBe(true);
    expect(updatedNotification?.readAt).toBeInstanceOf(Date);
  });
});
