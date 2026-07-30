import { NotificationModel } from "@/features/notification/models/notification.model";
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
import {
  createAuthedUserContext,
  createProject,
  createUser,
} from "@/test/helpers/testFactories";
import { processProjectDueSoonNotifications } from "@/features/notification/services/deadlines/processProjectDueSoonNotifications.service";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterEach(() => {
  vi.useRealTimers();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("processProjectDueSoonNotifications", () => {
  it("creates a project_due_soon notification for a project due within the next 72 hours", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const { userId, workspaceId } = await createAuthedUserContext();
    const dueDate = new Date("2026-08-01T09:00:00.000Z");

    const project = await createProject({
      workspaceId,
      dueDate,
      invitedUserIds: [userId],
    });

    await processProjectDueSoonNotifications();

    const notifications = await NotificationModel.find({}).lean();

    expect(notifications).toHaveLength(1);
    expect(notifications[0]).toEqual(
      expect.objectContaining({
        workspaceId,
        recipientId: userId,
        entityId: project._id,
        type: "project_due_soon",
        entityType: "project",
        deadlineAt: dueDate,
        isRead: false,
      }),
    );
  });

  it("does not create notifications for done projects", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const { userId, workspaceId } = await createAuthedUserContext();
    const dueDate = new Date("2026-08-01T09:00:00.000Z");

    await createProject({
      workspaceId,
      dueDate,
      projectStatus: "done",
      invitedUserIds: [userId],
    });

    await processProjectDueSoonNotifications();

    const notifications = await NotificationModel.find({}).lean();

    expect(notifications).toHaveLength(0);
  });

  it("does not create notifications for projects without invited users", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const { workspaceId } = await createAuthedUserContext();
    const dueDate = new Date("2026-08-01T09:00:00.000Z");

    await createProject({
      workspaceId,
      dueDate,
      invitedUserIds: [],
    });

    await processProjectDueSoonNotifications();

    const notifications = await NotificationModel.find({}).lean();

    expect(notifications).toHaveLength(0);
  });

  it("does not create notifications for projects outside the 72 hour window", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const { userId, workspaceId } = await createAuthedUserContext();
    const dueDate = new Date("2026-08-06T09:00:00.000Z");

    await createProject({
      workspaceId,
      dueDate,
      invitedUserIds: [userId],
    });

    await processProjectDueSoonNotifications();

    const notifications = await NotificationModel.find({}).lean();

    expect(notifications).toHaveLength(0);
  });

  it("creates one project_due_soon notification for each invited user", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const { userId, workspaceId } = await createAuthedUserContext();
    const invitedUser = await createUser({ workspaceId });
    const dueDate = new Date("2026-08-01T09:00:00.000Z");

    const project = await createProject({
      workspaceId,
      dueDate,
      invitedUserIds: [userId, invitedUser._id],
    });

    await processProjectDueSoonNotifications();

    const notifications = await NotificationModel.find({
      type: "project_due_soon",
      entityId: project._id,
    }).lean();

    expect(notifications).toHaveLength(2);
    expect(
      notifications
        .map((notification) => notification.recipientId.toString())
        .sort(),
    ).toEqual([userId.toString(), invitedUser._id.toString()].sort());
  });

  it("does not create duplicate notifications when the process runs twice", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const { userId, workspaceId } = await createAuthedUserContext();
    const invitedUser = await createUser({ workspaceId });
    const dueDate = new Date("2026-08-01T09:00:00.000Z");

    const project = await createProject({
      workspaceId,
      dueDate,
      invitedUserIds: [userId, invitedUser._id],
    });

    await processProjectDueSoonNotifications();
    await processProjectDueSoonNotifications();

    const notifications = await NotificationModel.find({
      type: "project_due_soon",
      entityId: project._id,
    }).lean();

    expect(notifications).toHaveLength(2);
    expect(
      notifications
        .map((notification) => notification.recipientId.toString())
        .sort(),
    ).toEqual([userId.toString(), invitedUser._id.toString()].sort());
  });

  it("does not create notifications for projects with an already passed deadline", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const { userId, workspaceId } = await createAuthedUserContext();
    const dueDate = new Date("2026-07-30T09:00:00.000Z");

    await createProject({
      workspaceId,
      dueDate,
      invitedUserIds: [userId],
    });

    await processProjectDueSoonNotifications();

    const notifications = await NotificationModel.find({}).lean();

    expect(notifications).toHaveLength(0);
  });

  it("creates new notifications when the project deadline changes", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const { userId, workspaceId } = await createAuthedUserContext();
    const invitedUser = await createUser({ workspaceId });
    const firstDueDate = new Date("2026-08-01T09:00:00.000Z");
    const changedDueDate = new Date("2026-08-02T09:00:00.000Z");

    const project = await createProject({
      workspaceId,
      dueDate: firstDueDate,
      invitedUserIds: [userId, invitedUser._id],
    });

    await processProjectDueSoonNotifications();
    await project.updateOne({ dueDate: changedDueDate });
    await processProjectDueSoonNotifications();

    const notifications = await NotificationModel.find({
      type: "project_due_soon",
      entityId: project._id,
    }).lean();

    expect(notifications).toHaveLength(4);
    expect(
      notifications
        .map((notification) => notification.deadlineAt?.toISOString())
        .sort(),
    ).toEqual([
      firstDueDate.toISOString(),
      firstDueDate.toISOString(),
      changedDueDate.toISOString(),
      changedDueDate.toISOString(),
    ]);
  });
});
