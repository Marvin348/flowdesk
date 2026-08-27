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
import { handleTaskDueSoonNotifications } from "@/features/notification/handlers/deadlines/handleTaskDueSoonNotifications";
import { notificationQueue } from "@/queues/notificationQueue";
import { publishRealtimeNotification } from "@/features/notification/handlers/publishRealtimeNotification";
import { createNotification } from "@/features/notification/services/createNotification.service";
import { Types } from "mongoose";

vi.mock("@/features/notification/services/createNotification.service", () => ({
  createNotification: vi.fn(),
}));

vi.mock("@/features/notification/handlers/publishRealtimeNotification", () => ({
  publishRealtimeNotification: vi.fn(),
}));

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
  vi.mocked(notificationQueue.add).mockClear();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("processTaskDueSoonNotifications", () => {
  it("queues a task-due-soon notification job with all task collaborators", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

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
    queueAddMock.mockClear();

    await processTaskDueSoonNotifications();

    expect(queueAddMock).toHaveBeenCalledOnce();
    expect(queueAddMock).toHaveBeenCalledWith("task-due-soon", {
      workspaceId: workspaceId.toString(),
      taskId: task._id.toString(),
      projectId: project._id.toString(),
      collaboratorIds: [userId.toString(), collaborator._id.toString()],
      deadlineAt: dueDate.toISOString(),
    });
  });

  it("does not queue notification jobs for done tasks", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

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
    queueAddMock.mockClear();

    await processTaskDueSoonNotifications();

    expect(queueAddMock).not.toHaveBeenCalled();
  });

  it("does not queue notification jobs for tasks without collaborators", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

    const { workspaceId } = await createAuthedUserContext();
    const project = await createProject({ workspaceId });
    const dueDate = new Date("2026-08-01T09:00:00.000Z");

    await createTask({
      workspaceId,
      projectId: project._id,
      dueDate,
      collaboratorIds: [],
    });
    queueAddMock.mockClear();

    await processTaskDueSoonNotifications();

    expect(queueAddMock).not.toHaveBeenCalled();
  });

  it("does not queue notification jobs for tasks outside the 72 hour window", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

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
    queueAddMock.mockClear();

    await processTaskDueSoonNotifications();

    expect(queueAddMock).not.toHaveBeenCalled();
  });

  it("queues matching task jobs each time the process runs", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

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
    queueAddMock.mockClear();

    await processTaskDueSoonNotifications();
    await processTaskDueSoonNotifications();

    expect(queueAddMock).toHaveBeenCalledTimes(2);
    expect(queueAddMock).toHaveBeenNthCalledWith(1, "task-due-soon", {
      workspaceId: workspaceId.toString(),
      taskId: task._id.toString(),
      projectId: project._id.toString(),
      collaboratorIds: [userId.toString(), collaborator._id.toString()],
      deadlineAt: dueDate.toISOString(),
    });
    expect(queueAddMock).toHaveBeenNthCalledWith(2, "task-due-soon", {
      workspaceId: workspaceId.toString(),
      taskId: task._id.toString(),
      projectId: project._id.toString(),
      collaboratorIds: [userId.toString(), collaborator._id.toString()],
      deadlineAt: dueDate.toISOString(),
    });
  });

  it("does not queue notification jobs for tasks with an already passed deadline", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

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
    queueAddMock.mockClear();

    await processTaskDueSoonNotifications();

    expect(queueAddMock).not.toHaveBeenCalled();
  });

  it("queues jobs with the current task deadline when the task deadline changes", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));
    
    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

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
    queueAddMock.mockClear();

    await processTaskDueSoonNotifications();
    await task.updateOne({ dueDate: changedDueDate });
    await processTaskDueSoonNotifications();

    expect(queueAddMock).toHaveBeenCalledTimes(2);
    expect(queueAddMock).toHaveBeenNthCalledWith(1, "task-due-soon", {
      workspaceId: workspaceId.toString(),
      taskId: task._id.toString(),
      projectId: project._id.toString(),
      collaboratorIds: [userId.toString(), collaborator._id.toString()],
      deadlineAt: firstDueDate.toISOString(),
    });
    expect(queueAddMock).toHaveBeenNthCalledWith(2, "task-due-soon", {
      workspaceId: workspaceId.toString(),
      taskId: task._id.toString(),
      projectId: project._id.toString(),
      collaboratorIds: [userId.toString(), collaborator._id.toString()],
      deadlineAt: changedDueDate.toISOString(),
    });
  });
});

describe("handleTaskDueSoonNotifications", () => {
  it("publishes realtime notifications to task collaborators", async () => {
    const workspaceId = new Types.ObjectId().toString();
    const taskId = new Types.ObjectId().toString();
    const projectId = new Types.ObjectId().toString();
    const collaboratorIds = [
      new Types.ObjectId().toString(),
      new Types.ObjectId().toString(),
    ];
    const deadlineAt = new Date("2026-08-01T09:00:00.000Z").toISOString();

    await handleTaskDueSoonNotifications({
      workspaceId,
      taskId,
      projectId,
      collaboratorIds,
      deadlineAt,
    });

    expect(createNotification).toHaveBeenCalledTimes(2);
    expect(publishRealtimeNotification).toHaveBeenCalledOnce();
    expect(publishRealtimeNotification).toHaveBeenCalledWith(collaboratorIds);
  });
});
