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
  createTask,
  createUser,
} from "@/test/helpers/testFactories";
import { processTaskOverdueNotifications } from "@/features/notification/services/deadlines/processTaskOverdueNotifications.service";

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

describe("processTaskOverdueNotifications", () => {
  it("creates a task_overdue notification for a task due within the last 48 hours", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const { userId, workspaceId } = await createAuthedUserContext();
    const project = await createProject({ workspaceId });
    const dueDate = new Date("2026-07-29T09:00:00.000Z");

    const task = await createTask({
      workspaceId,
      projectId: project._id,
      dueDate,
      collaboratorIds: [userId],
    });

    await processTaskOverdueNotifications();

    const notifications = await NotificationModel.find({}).lean();

    expect(notifications).toHaveLength(1);
    expect(notifications[0]).toEqual(
      expect.objectContaining({
        workspaceId,
        recipientId: userId,
        entityId: task._id,
        type: "task_overdue",
        entityType: "task",
        projectId: project._id,
        deadlineAt: dueDate,
        isRead: false,
      }),
    );
  });

  it("does not create notifications for tasks due more than 48 hours ago", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const { userId, workspaceId } = await createAuthedUserContext();
    const project = await createProject({ workspaceId });
    const dueDate = new Date("2026-07-28T09:00:00.000Z");

    await createTask({
      workspaceId,
      projectId: project._id,
      dueDate,
      collaboratorIds: [userId],
    });

    await processTaskOverdueNotifications();

    const notifications = await NotificationModel.find({}).lean();

    expect(notifications).toHaveLength(0);
  });

  it("does not create notifications for done tasks", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const { userId, workspaceId } = await createAuthedUserContext();
    const project = await createProject({ workspaceId });
    const dueDate = new Date("2026-07-29T09:00:00.000Z");

    await createTask({
      workspaceId,
      projectId: project._id,
      dueDate,
      taskStatus: "done",
      collaboratorIds: [userId],
    });

    await processTaskOverdueNotifications();

    const notifications = await NotificationModel.find({}).lean();

    expect(notifications).toHaveLength(0);
  });

  it("creates one task_overdue notification for each task collaborator", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const { userId, workspaceId } = await createAuthedUserContext();
    const collaborator = await createUser({ workspaceId });
    const project = await createProject({ workspaceId });
    const dueDate = new Date("2026-07-29T09:00:00.000Z");

    const task = await createTask({
      workspaceId,
      projectId: project._id,
      dueDate,
      collaboratorIds: [userId, collaborator._id],
    });

    await processTaskOverdueNotifications();

    const notifications = await NotificationModel.find({
      type: "task_overdue",
      entityId: task._id,
    }).lean();

    expect(notifications).toHaveLength(2);
    expect(
      notifications
        .map((notification) => notification.recipientId.toString())
        .sort(),
    ).toEqual([userId.toString(), collaborator._id.toString()].sort());
  });

  it("does not create duplicate notifications when the process runs twice", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const { userId, workspaceId } = await createAuthedUserContext();
    const collaborator = await createUser({ workspaceId });
    const project = await createProject({ workspaceId });
    const dueDate = new Date("2026-07-29T09:00:00.000Z");

    const task = await createTask({
      workspaceId,
      projectId: project._id,
      dueDate,
      collaboratorIds: [userId, collaborator._id],
    });

    await processTaskOverdueNotifications();
    await processTaskOverdueNotifications();

    const notifications = await NotificationModel.find({
      type: "task_overdue",
      entityId: task._id,
    }).lean();

    expect(notifications).toHaveLength(2);
    expect(
      notifications
        .map((notification) => notification.recipientId.toString())
        .sort(),
    ).toEqual([userId.toString(), collaborator._id.toString()].sort());
  });

  it("creates new notifications when the task deadline changes", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const { userId, workspaceId } = await createAuthedUserContext();
    const collaborator = await createUser({ workspaceId });
    const project = await createProject({ workspaceId });
    const firstDueDate = new Date("2026-07-29T09:00:00.000Z");
    const changedDueDate = new Date("2026-07-29T08:00:00.000Z");

    const task = await createTask({
      workspaceId,
      projectId: project._id,
      dueDate: firstDueDate,
      collaboratorIds: [userId, collaborator._id],
    });

    await processTaskOverdueNotifications();
    await task.updateOne({ dueDate: changedDueDate });
    await processTaskOverdueNotifications();

    const notifications = await NotificationModel.find({
      type: "task_overdue",
      entityId: task._id,
    }).lean();

    expect(notifications).toHaveLength(4);
    expect(
      notifications
        .map((notification) => notification.deadlineAt?.toISOString())
        .sort(),
    ).toEqual([
      changedDueDate.toISOString(),
      changedDueDate.toISOString(),
      firstDueDate.toISOString(),
      firstDueDate.toISOString(),
    ]);
  });

});
