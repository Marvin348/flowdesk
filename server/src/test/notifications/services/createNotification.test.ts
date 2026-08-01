import { NotificationModel } from "@/features/notification/models/notification.model";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import { createAuthedUserContext } from "@/test/helpers/testFactories";
import { createNotification } from "@/features/notification/services/createNotification.service";
import mongoose from "mongoose";
import { UserModel } from "@/features/users/models/user.modal";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("createNotification", () => {
  it("creates a notification with the provided fields", async () => {
    const { userId, workspaceId } = await createAuthedUserContext();
    const actorId = new mongoose.Types.ObjectId();
    const entityId = new mongoose.Types.ObjectId();
    const projectId = new mongoose.Types.ObjectId();
    const deadlineAt = new Date("2026-08-01T09:00:00.000Z");

    await createNotification({
      workspaceId,
      recipientId: userId,
      actorId,
      type: "task_due_soon",
      entityType: "task",
      entityId,
      projectId,
      deadlineAt,
    });

    const notification = await NotificationModel.findOne({}).lean();

    expect(notification).toEqual(
      expect.objectContaining({
        workspaceId,
        recipientId: userId,
        actorId,
        type: "task_due_soon",
        entityType: "task",
        entityId,
        projectId,
        deadlineAt,
        isRead: false,
      }),
    );
  });

  it("does not create a notification when the actor is the recipient", async () => {
    const { userId, workspaceId } = await createAuthedUserContext();

    await createNotification({
      workspaceId,
      recipientId: userId,
      actorId: userId,
      type: "task_assigned",
      entityType: "task",
    });

    const notifications = await NotificationModel.find({}).lean();

    expect(notifications).toHaveLength(0);
  });

  it("does not create a notification when the matching user setting is disabled", async () => {
    const { userId, workspaceId } = await createAuthedUserContext();

    await UserModel.findByIdAndUpdate(userId, {
      $set: { "settings.notifications.deadlines": false },
    });

    await createNotification({
      workspaceId,
      recipientId: userId,
      type: "project_due_soon",
      entityType: "project",
      entityId: new mongoose.Types.ObjectId(),
      deadlineAt: new Date("2026-08-01T09:00:00.000Z"),
    });

    const notifications = await NotificationModel.find({}).lean();

    expect(notifications).toHaveLength(0);
  });

  it("creates a security/account notification when the type is not controlled by user settings", async () => {
    const { userId, workspaceId } = await createAuthedUserContext();

    await UserModel.findByIdAndUpdate(userId, {
      $set: {
        "settings.notifications.assignments": false,
        "settings.notifications.comments": false,
        "settings.notifications.deadlines": false,
      },
    });

    await createNotification({
      workspaceId,
      recipientId: userId,
      type: "password_changed",
      entityType: "user",
    });

    const notifications = await NotificationModel.find({}).lean();

    expect(notifications).toHaveLength(1);
    expect(notifications[0]).toEqual(
      expect.objectContaining({
        workspaceId,
        recipientId: userId,
        type: "password_changed",
        entityType: "user",
        isRead: false,
      }),
    );
  });

  it("does not throw or create duplicates for the same deadline notification", async () => {
    const { userId, workspaceId } = await createAuthedUserContext();
    const entityId = new mongoose.Types.ObjectId();
    const deadlineAt = new Date("2026-08-01T09:00:00.000Z");

    await createNotification({
      workspaceId,
      recipientId: userId,
      type: "project_due_soon",
      entityType: "project",
      entityId,
      deadlineAt,
    });

    await createNotification({
      workspaceId,
      recipientId: userId,
      type: "project_due_soon",
      entityType: "project",
      entityId,
      deadlineAt,
    });

    const notifications = await NotificationModel.find({
      recipientId: userId,
      type: "project_due_soon",
      entityId,
    }).lean();

    expect(notifications).toHaveLength(1);
    expect(notifications[0].deadlineAt).toEqual(deadlineAt);
  });
});
