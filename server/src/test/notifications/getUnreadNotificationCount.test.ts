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

describe("GET /notifications/unread-count", () => {
  it("returns 401 if the user is not authenticated", async () => {
    const response = await request(app).get("/notifications/unread-count");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Not authenticated" });
  });

  it("returns 0 when the user has no unread notifications", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .get("/notifications/unread-count")
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ unreadCount: 0 });
  });

  it("returns the unread notification count for the authenticated user", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();
    const actor = await createUser({ workspaceId });
    const otherRecipient = await createUser({ workspaceId });
    const otherWorkspaceId = new mongoose.Types.ObjectId();

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
        type: "task_assigned",
        entityType: "task",
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
        isRead: true,
        readAt: new Date(),
      },
      {
        workspaceId,
        actorId: actor._id,
        recipientId: otherRecipient._id,
        type: "project_assigned",
        entityType: "project",
        entityId: new mongoose.Types.ObjectId(),
        isRead: false,
      },
      {
        workspaceId: otherWorkspaceId,
        actorId: actor._id,
        recipientId: userId,
        type: "project_assigned",
        entityType: "project",
        entityId: new mongoose.Types.ObjectId(),
        isRead: false,
      },
    ]);

    const response = await request(app)
      .get("/notifications/unread-count")
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ unreadCount: 2 });
  });
});
