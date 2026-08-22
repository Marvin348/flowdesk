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

describe("PATCH /notifications/:notificationId/pin", () => {
  it("returns 404 if the notification was not found", async () => {
    const { authCookie } = await createAuthedUserContext();

    const notificationId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .patch(`/notifications/${notificationId}/pin`)
      .send({ pinned: true })
      .set("Cookie", authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Notification not found",
    });
  });

  it("returns 400 if the notificationId is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .patch(`/notifications/:wrongId/pin`)
      .send({ pinned: true })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid notificationId",
    });
  });

  it("retuns 400 if the body was invalid", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();

    const notification = await NotificationModel.create({
      workspaceId,
      recipientId: userId,
      type: "role_changed",
      entityType: "user",
    });

    const response = await request(app)
      .patch(`/notifications/${notification._id.toString()}/pin`)
      .send({ false: true })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid body",
    });
  });

  it("pins the notification", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();

    const notification = await NotificationModel.create({
      workspaceId,
      recipientId: userId,
      type: "role_changed",
      entityType: "user",
      pinnedAt: null,
    });

    const response = await request(app)
      .patch(`/notifications/${notification._id.toString()}/pin`)
      .send({ pinned: true })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Notification pinned updated successfully",
    });

    const updatedNotification = await NotificationModel.findById(
      notification._id,
    );

    expect(updatedNotification).not.toBeNull();
    expect(updatedNotification?.pinnedAt).toBeInstanceOf(Date);
  });

  it("unpins the notification", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();

    const notification = await NotificationModel.create({
      workspaceId,
      recipientId: userId,
      type: "role_changed",
      entityType: "user",
      pinnedAt: new Date(),
    });

    const response = await request(app)
      .patch(`/notifications/${notification._id.toString()}/pin`)
      .send({ pinned: false })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Notification pinned updated successfully",
    });

    const updatedNotification = await NotificationModel.findById(
      notification._id,
    );

    expect(updatedNotification).not.toBeNull();
    expect(updatedNotification?.pinnedAt).toBeNull();
  });

  it("returns 404 if the notification belongs to another recipient", async () => {
    const { authCookie, workspaceId } = await createAuthedUserContext();
    const otherUser = await createUser({ workspaceId });

    const notification = await NotificationModel.create({
      workspaceId,
      recipientId: otherUser._id,
      type: "role_changed",
      entityType: "user",
      pinnedAt: null,
    });

    const response = await request(app)
      .patch(`/notifications/${notification._id.toString()}/pin`)
      .send({ pinned: true })
      .set("Cookie", authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Notification not found",
    });

    const unchangedNotification = await NotificationModel.findById(
      notification._id,
    );

    expect(unchangedNotification).not.toBeNull();
    expect(unchangedNotification?.pinnedAt).toBeNull();
  });
});
