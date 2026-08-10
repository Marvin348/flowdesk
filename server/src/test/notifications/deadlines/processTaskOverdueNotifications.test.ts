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
import { notificationQueue } from "@/queues/notificationQueue";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterEach(() => {
  vi.useRealTimers();
  vi.mocked(notificationQueue.add).mockClear();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("processTaskOverdueNotifications", () => {
  it("queues a task-overdue notification job for a task due within the last 48 hours", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

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

    expect(queueAddMock).toHaveBeenCalledOnce();
    expect(queueAddMock).toHaveBeenCalledWith("task-overdue", {
      workspaceId: workspaceId.toString(),
      taskId: task._id.toString(),
      projectId: project._id.toString(),
      collaboratorIds: [userId.toString()],
      deadlineAt: dueDate.toISOString(),
    });
  });

  it("does not queue notification jobs for tasks due more than 48 hours ago", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

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

    expect(queueAddMock).not.toHaveBeenCalled();
  });

  it("does not queue notification jobs for done tasks", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));
    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

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

    expect(queueAddMock).not.toHaveBeenCalled();
  });

  it("queues collaborator ids in the task-overdue notification job", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

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

    expect(queueAddMock).toHaveBeenCalledOnce();
    expect(queueAddMock).toHaveBeenCalledWith("task-overdue", {
      workspaceId: workspaceId.toString(),
      taskId: task._id.toString(),
      projectId: project._id.toString(),
      collaboratorIds: [userId.toString(), collaborator._id.toString()],
      deadlineAt: dueDate.toISOString(),
    });
  });

  it("queues matching task jobs each time the process runs", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

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

    expect(queueAddMock).toHaveBeenCalledTimes(2);
    expect(queueAddMock).toHaveBeenNthCalledWith(1, "task-overdue", {
      workspaceId: workspaceId.toString(),
      taskId: task._id.toString(),
      projectId: project._id.toString(),
      collaboratorIds: [userId.toString(), collaborator._id.toString()],
      deadlineAt: dueDate.toISOString(),
    });
    expect(queueAddMock).toHaveBeenNthCalledWith(2, "task-overdue", {
      workspaceId: workspaceId.toString(),
      taskId: task._id.toString(),
      projectId: project._id.toString(),
      collaboratorIds: [userId.toString(), collaborator._id.toString()],
      deadlineAt: dueDate.toISOString(),
    });
  });

  it("queues jobs with the current task deadline when the task deadline changes", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));
    
    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

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

    expect(queueAddMock).toHaveBeenCalledTimes(2);
    expect(queueAddMock).toHaveBeenNthCalledWith(1, "task-overdue", {
      workspaceId: workspaceId.toString(),
      taskId: task._id.toString(),
      projectId: project._id.toString(),
      collaboratorIds: [userId.toString(), collaborator._id.toString()],
      deadlineAt: firstDueDate.toISOString(),
    });
    expect(queueAddMock).toHaveBeenNthCalledWith(2, "task-overdue", {
      workspaceId: workspaceId.toString(),
      taskId: task._id.toString(),
      projectId: project._id.toString(),
      collaboratorIds: [userId.toString(), collaborator._id.toString()],
      deadlineAt: changedDueDate.toISOString(),
    });
  });
});
