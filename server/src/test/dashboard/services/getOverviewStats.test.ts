import { getOverviewStats } from "@/features/dashboard/services/dashboardOverviewStats.service";
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
} from "@/test/helpers/testFactories";
import mongoose from "mongoose";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 7, 5, 12));
  await clearTestDb();
});

afterEach(() => {
  vi.useRealTimers();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("getOverviewStats", () => {
  it("returns zero counts when the workspace has no projects or tasks", async () => {
    const { workspaceId } = await createAuthedUserContext();

    const stats = await getOverviewStats({ workspaceId });

    expect(stats).toEqual({
      activeProjects: 0,
      openTasks: 0,
      overdueTasks: 0,
      tasksDueThisWeek: 0,
    });
  });

  it("counts active projects and task deadline stats for the workspace", async () => {
    const { workspaceId } = await createAuthedUserContext();
    const otherWorkspaceId = new mongoose.Types.ObjectId();

    const project = await createProject({
      workspaceId,
      projectStatus: "in_progress",
    });

    await createProject({
      workspaceId,
      projectStatus: "pending",
    });

    await createProject({
      workspaceId,
      projectStatus: "done",
    });

    await createProject({
      workspaceId: otherWorkspaceId,
      projectStatus: "in_progress",
    });

    await createTask({
      workspaceId,
      projectId: project._id,
      taskStatus: "pending",
      dueDate: new Date(2026, 7, 4, 10),
    });

    await createTask({
      workspaceId,
      projectId: project._id,
      taskStatus: "in_progress",
      dueDate: new Date(2026, 7, 5, 14),
    });

    await createTask({
      workspaceId,
      projectId: project._id,
      taskStatus: "pending",
      dueDate: new Date(2026, 7, 9, 18),
    });

    await createTask({
      workspaceId,
      projectId: project._id,
      taskStatus: "pending",
      dueDate: new Date(2026, 7, 10, 9),
    });

    await createTask({
      workspaceId,
      projectId: project._id,
      taskStatus: "done",
      dueDate: new Date(2026, 7, 4, 10),
    });

    await createTask({
      workspaceId: otherWorkspaceId,
      taskStatus: "pending",
      dueDate: new Date(2026, 7, 4, 10),
    });

    const stats = await getOverviewStats({ workspaceId });

    expect(stats).toEqual({
      activeProjects: 2,
      openTasks: 4,
      overdueTasks: 1,
      tasksDueThisWeek: 2,
    });
  });
});
