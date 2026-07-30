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
import { processTaskDueSoonNotifications } from "@/features/notification/services/deadlines/processTaskDueSoonNotifications.service";

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

describe("processTaskDueSoonNotifications", () => {
  it("creates one task_due_soon notification for each task collaborator", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const { userId, workspaceId } = await createAuthedUserContext();
    const collaborator = await createUser({ workspaceId });
    const project = await createProject({ workspaceId });
    const dueDate = new Date("2026-08-01T09:00:00.000Z");

    const task = await createTask({
      workspaceId,
      projectId: project._id,
      dueDate,
      collaboratorIds: [userId, collaborator._id],
    });

    await processTaskDueSoonNotifications();

    const notifications = await NotificationModel.find({}).lean();

    expect(notifications).toHaveLength(2);
    expect(notifications).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          workspaceId,
          recipientId: userId,
          entityId: task._id,
          type: "task_due_soon",
          entityType: "task",
          projectId: project._id,
          deadlineAt: dueDate,
          isRead: false,
        }),
        expect.objectContaining({
          workspaceId,
          recipientId: collaborator._id,
          entityId: task._id,
          type: "task_due_soon",
          entityType: "task",
          projectId: project._id,
          deadlineAt: dueDate,
          isRead: false,
        }),
      ]),
    );
  });

  it("does not create a notification for done tasks", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const { userId, workspaceId } = await createAuthedUserContext();
    const collaborator = await createUser({ workspaceId });
    const project = await createProject({ workspaceId });
    const dueDate = new Date("2026-08-01T09:00:00.000Z");

    await createTask({
      workspaceId,
      projectId: project._id,
      dueDate,
      taskStatus: "done",
      collaboratorIds: [userId, collaborator._id],
    });

    await processTaskDueSoonNotifications();

    const notifications = await NotificationModel.find({}).lean();
    expect(notifications).toHaveLength(0);
  });

  it("does not create notifications for tasks without collaborators", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const { workspaceId } = await createAuthedUserContext();
    const project = await createProject({ workspaceId });
    const dueDate = new Date("2026-08-01T09:00:00.000Z");

    await createTask({
      workspaceId,
      projectId: project._id,
      dueDate,
      collaboratorIds: [],
    });

    await processTaskDueSoonNotifications();

    const notifications = await NotificationModel.find({}).lean();
    expect(notifications).toHaveLength(0);
  });

  it("does not create notifications for tasks outside the 72 hour window", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const { userId, workspaceId } = await createAuthedUserContext();
    const collaborator = await createUser({ workspaceId });
    const project = await createProject({ workspaceId });
    const dueDate = new Date("2026-08-06T09:00:00.000Z");

    await createTask({
      workspaceId,
      projectId: project._id,
      dueDate,
      collaboratorIds: [userId, collaborator._id],
    });

    await processTaskDueSoonNotifications();

    const notifications = await NotificationModel.find({}).lean();
    expect(notifications).toHaveLength(0);
  });

  it("does not create duplicate notifications when the process runs twice", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const { userId, workspaceId } = await createAuthedUserContext();
    const collaborator = await createUser({ workspaceId });
    const project = await createProject({ workspaceId });
    const dueDate = new Date("2026-08-01T09:00:00.000Z");

    const task = await createTask({
      workspaceId,
      projectId: project._id,
      dueDate,
      collaboratorIds: [userId, collaborator._id],
    });

    await processTaskDueSoonNotifications();
    await processTaskDueSoonNotifications();

    const notifications = await NotificationModel.find({
      type: "task_due_soon",
      entityId: task._id,
    }).lean();

    expect(notifications).toHaveLength(2);

    expect(
      notifications
        .map((notification) => notification.recipientId.toString())
        .sort(),
    ).toEqual([userId.toString(), collaborator._id.toString()].sort());
  });

  it("does not create notifications for tasks with an already passed deadline", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const { userId, workspaceId } = await createAuthedUserContext();
    const collaborator = await createUser({ workspaceId });
    const project = await createProject({ workspaceId });
    const dueDate = new Date("2026-07-30T09:00:00.000Z");

    await createTask({
      workspaceId,
      projectId: project._id,
      dueDate,
      collaboratorIds: [userId, collaborator._id],
    });

    await processTaskDueSoonNotifications();

    const notifications = await NotificationModel.find({}).lean();

    expect(notifications).toHaveLength(0);
  });

  it("creates new notifications when the task deadline changes", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const { userId, workspaceId } = await createAuthedUserContext();
    const collaborator = await createUser({ workspaceId });
    const project = await createProject({ workspaceId });
    const firstDueDate = new Date("2026-08-01T09:00:00.000Z");
    const changedDueDate = new Date("2026-08-02T09:00:00.000Z");

    const task = await createTask({
      workspaceId,
      projectId: project._id,
      dueDate: firstDueDate,
      collaboratorIds: [userId, collaborator._id],
    });

    await processTaskDueSoonNotifications();
    await task.updateOne({ dueDate: changedDueDate });
    await processTaskDueSoonNotifications();

    const notifications = await NotificationModel.find({
      type: "task_due_soon",
      entityId: task._id,
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
