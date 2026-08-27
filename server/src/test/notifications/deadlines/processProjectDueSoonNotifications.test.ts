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
import { handleProjectDueSoonNotification } from "@/features/notification/handlers/deadlines/handleProjectDueSoonNotification";
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

describe("processProjectDueSoonNotifications", () => {
  it("queues a project-due-soon notification job for a project due within the next 72 hours", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

    const { userId, workspaceId } = await createAuthedUserContext();
    const dueDate = new Date("2026-08-01T09:00:00.000Z");

    const project = await createProject({
      workspaceId,
      dueDate,
      invitedUserIds: [userId],
    });

    queueAddMock.mockClear();

    await processProjectDueSoonNotifications();

    expect(queueAddMock).toHaveBeenCalledOnce();
    expect(queueAddMock).toHaveBeenCalledWith("project-due-soon", {
      workspaceId: workspaceId.toString(),
      projectId: project._id.toString(),
      invitedUserIds: [userId.toString()],
      deadlineAt: dueDate.toISOString(),
    });
  });

  it("does not queue notification jobs for done projects", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

    const { userId, workspaceId } = await createAuthedUserContext();
    const dueDate = new Date("2026-08-01T09:00:00.000Z");

    await createProject({
      workspaceId,
      dueDate,
      projectStatus: "done",
      invitedUserIds: [userId],
    });
    queueAddMock.mockClear();

    await processProjectDueSoonNotifications();

    expect(queueAddMock).not.toHaveBeenCalled();
  });

  it("does not queue notification jobs for projects without invited users", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

    const { workspaceId } = await createAuthedUserContext();
    const dueDate = new Date("2026-08-01T09:00:00.000Z");

    await createProject({
      workspaceId,
      dueDate,
      invitedUserIds: [],
    });
    queueAddMock.mockClear();

    await processProjectDueSoonNotifications();

    expect(queueAddMock).not.toHaveBeenCalled();
  });

  it("does not queue notification jobs for projects outside the 72 hour window", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

    const { userId, workspaceId } = await createAuthedUserContext();
    const dueDate = new Date("2026-08-06T09:00:00.000Z");

    await createProject({
      workspaceId,
      dueDate,
      invitedUserIds: [userId],
    });
    queueAddMock.mockClear();

    await processProjectDueSoonNotifications();

    expect(queueAddMock).not.toHaveBeenCalled();
  });

  it("queues invited user ids in the project-due-soon notification job", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

    const { userId, workspaceId } = await createAuthedUserContext();
    const invitedUser = await createUser({ workspaceId });
    const dueDate = new Date("2026-08-01T09:00:00.000Z");

    const project = await createProject({
      workspaceId,
      dueDate,
      invitedUserIds: [userId, invitedUser._id],
    });
    queueAddMock.mockClear();

    await processProjectDueSoonNotifications();

    expect(queueAddMock).toHaveBeenCalledOnce();
    expect(queueAddMock).toHaveBeenCalledWith("project-due-soon", {
      workspaceId: workspaceId.toString(),
      projectId: project._id.toString(),
      invitedUserIds: [userId.toString(), invitedUser._id.toString()],
      deadlineAt: dueDate.toISOString(),
    });
  });

  it("queues matching project jobs each time the process runs", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

    const { userId, workspaceId } = await createAuthedUserContext();
    const invitedUser = await createUser({ workspaceId });
    const dueDate = new Date("2026-08-01T09:00:00.000Z");

    const project = await createProject({
      workspaceId,
      dueDate,
      invitedUserIds: [userId, invitedUser._id],
    });
    queueAddMock.mockClear();

    await processProjectDueSoonNotifications();
    await processProjectDueSoonNotifications();

    expect(queueAddMock).toHaveBeenCalledTimes(2);
    expect(queueAddMock).toHaveBeenNthCalledWith(1, "project-due-soon", {
      workspaceId: workspaceId.toString(),
      projectId: project._id.toString(),
      invitedUserIds: [userId.toString(), invitedUser._id.toString()],
      deadlineAt: dueDate.toISOString(),
    });
    expect(queueAddMock).toHaveBeenNthCalledWith(2, "project-due-soon", {
      workspaceId: workspaceId.toString(),
      projectId: project._id.toString(),
      invitedUserIds: [userId.toString(), invitedUser._id.toString()],
      deadlineAt: dueDate.toISOString(),
    });
  });

  it("does not queue notification jobs for projects with an already passed deadline", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

    const { userId, workspaceId } = await createAuthedUserContext();
    const dueDate = new Date("2026-07-30T09:00:00.000Z");

    await createProject({
      workspaceId,
      dueDate,
      invitedUserIds: [userId],
    });
    queueAddMock.mockClear();

    await processProjectDueSoonNotifications();

    expect(queueAddMock).not.toHaveBeenCalled();
  });

  it("queues jobs with the current project deadline when the project deadline changes", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T10:00:00.000Z"));

    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

    const { userId, workspaceId } = await createAuthedUserContext();
    const invitedUser = await createUser({ workspaceId });
    const firstDueDate = new Date("2026-08-01T09:00:00.000Z");
    const changedDueDate = new Date("2026-08-02T09:00:00.000Z");

    const project = await createProject({
      workspaceId,
      dueDate: firstDueDate,
      invitedUserIds: [userId, invitedUser._id],
    });
    queueAddMock.mockClear();

    await processProjectDueSoonNotifications();
    await project.updateOne({ dueDate: changedDueDate });
    await processProjectDueSoonNotifications();

    expect(queueAddMock).toHaveBeenCalledTimes(2);
    expect(queueAddMock).toHaveBeenNthCalledWith(1, "project-due-soon", {
      workspaceId: workspaceId.toString(),
      projectId: project._id.toString(),
      invitedUserIds: [userId.toString(), invitedUser._id.toString()],
      deadlineAt: firstDueDate.toISOString(),
    });
    expect(queueAddMock).toHaveBeenNthCalledWith(2, "project-due-soon", {
      workspaceId: workspaceId.toString(),
      projectId: project._id.toString(),
      invitedUserIds: [userId.toString(), invitedUser._id.toString()],
      deadlineAt: changedDueDate.toISOString(),
    });
  });
});

describe("handleProjectDueSoonNotification", () => {
  it("publishes realtime notifications to invited users", async () => {
    const workspaceId = new Types.ObjectId().toString();
    const projectId = new Types.ObjectId().toString();
    const invitedUserIds = [
      new Types.ObjectId().toString(),
      new Types.ObjectId().toString(),
    ];
    const deadlineAt = new Date("2026-08-01T09:00:00.000Z").toISOString();

    await handleProjectDueSoonNotification({
      workspaceId,
      projectId,
      invitedUserIds,
      deadlineAt,
    });

    expect(createNotification).toHaveBeenCalledTimes(2);
    expect(publishRealtimeNotification).toHaveBeenCalledOnce();
    expect(publishRealtimeNotification).toHaveBeenCalledWith(invitedUserIds);
  });
});
