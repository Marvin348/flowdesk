import app from "@/app";
import { NotificationModel } from "@/features/notification/models/notification.model";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import request from "supertest";
import { createAuthedUserContext } from "@/test/helpers/testFactories";
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

describe("DELETE /notifications/:notificationId", () => {
  it("returns 400 if the notificationId is not valid", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .delete("/notifications/:invalidId")
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid notificationId" });
  });

  it("returns 404 if the notification was not found", async () => {
    const { authCookie } = await createAuthedUserContext();
    const notificationId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/notifications/${notificationId}`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Notification not found" });
  });

  it("deletes the notification", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();
    const notificationId = new mongoose.Types.ObjectId();

    await NotificationModel.create({
      _id: notificationId,
      workspaceId,
      recipientId: userId,
      type: "task_assigned",
      entityType: "task",
    });

    const response = await request(app)
      .delete(`/notifications/${notificationId}`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Notification deleted successfully",
    });

    const deletedNotification =
      await NotificationModel.findById(notificationId);

    expect(deletedNotification).toBeNull();
  });
});
