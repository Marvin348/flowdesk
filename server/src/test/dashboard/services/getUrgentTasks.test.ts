import { getDashboardUrgentTasks } from "@/features/dashboard/services/dashboardUrgentTasks.service";
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
import { toIsoString } from "@/utils/toIsoString";
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

describe("getDashboardUrgentTasks", () => {
  it("returns empty urgent task groups when the workspace has no tasks", async () => {
    const { workspaceId } = await createAuthedUserContext();

    const urgentTasks = await getDashboardUrgentTasks({ workspaceId });

    expect(urgentTasks).toEqual({
      dueThisWeek: {
        total: 0,
        items: [],
      },
      overdue: {
        total: 0,
        items: [],
      },
    });
  });

  it("returns due-this-week and overdue tasks for the workspace", async () => {
    const { workspaceId } = await createAuthedUserContext();
    const otherWorkspaceId = new mongoose.Types.ObjectId();
    const project = await createProject({
      workspaceId,
      title: "Dashboard Project",
    });

    const dueToday = await createTask({
      workspaceId,
      projectId: project._id,
      title: "Due Today",
      taskStatus: "pending",
      taskPriority: "high",
      dueDate: new Date(2026, 7, 5, 14),
    });

    const dueSunday = await createTask({
      workspaceId,
      projectId: project._id,
      title: "Due Sunday",
      taskStatus: "in_progress",
      taskPriority: "medium",
      dueDate: new Date(2026, 7, 9, 10),
    });

    const overdue = await createTask({
      workspaceId,
      projectId: project._id,
      title: "Overdue",
      taskStatus: "pending",
      taskPriority: "low",
      dueDate: new Date(2026, 7, 4, 10),
    });

    await createTask({
      workspaceId,
      projectId: project._id,
      title: "Done Overdue",
      taskStatus: "done",
      dueDate: new Date(2026, 7, 4, 10),
    });

    await createTask({
      workspaceId,
      projectId: project._id,
      title: "Future Task",
      taskStatus: "pending",
      dueDate: new Date(2026, 7, 10, 10),
    });

    await createTask({
      workspaceId: otherWorkspaceId,
      title: "Other Workspace Task",
      taskStatus: "pending",
      dueDate: new Date(2026, 7, 5, 10),
    });

    const urgentTasks = await getDashboardUrgentTasks({ workspaceId });

    expect(urgentTasks).toEqual({
      dueThisWeek: {
        total: 2,
        items: [
          {
            id: dueToday._id.toString(),
            title: "Due Today",
            dueDate: toIsoString(dueToday.dueDate),
            taskStatus: "pending",
            taskPriority: "high",
            project: {
              id: project._id.toString(),
              title: "Dashboard Project",
            },
          },
          {
            id: dueSunday._id.toString(),
            title: "Due Sunday",
            dueDate: toIsoString(dueSunday.dueDate),
            taskStatus: "in_progress",
            taskPriority: "medium",
            project: {
              id: project._id.toString(),
              title: "Dashboard Project",
            },
          },
        ],
      },
      overdue: {
        total: 1,
        items: [
          {
            id: overdue._id.toString(),
            title: "Overdue",
            dueDate: toIsoString(overdue.dueDate),
            taskStatus: "pending",
            taskPriority: "low",
            project: {
              id: project._id.toString(),
              title: "Dashboard Project",
            },
          },
        ],
      },
    });
  });

  it("limits displayed tasks to seven and prioritizes tasks due this week", async () => {
    const { workspaceId } = await createAuthedUserContext();
    const project = await createProject({ workspaceId });

    for (let index = 0; index < 5; index += 1) {
      await createTask({
        workspaceId,
        projectId: project._id,
        title: `Due This Week ${index + 1}`,
        taskStatus: "pending",
        dueDate: new Date(2026, 7, 5 + index, 10),
      });
    }

    for (let index = 0; index < 5; index += 1) {
      await createTask({
        workspaceId,
        projectId: project._id,
        title: `Overdue ${index + 1}`,
        taskStatus: "pending",
        dueDate: new Date(2026, 6, 31 + index, 10),
      });
    }

    const urgentTasks = await getDashboardUrgentTasks({ workspaceId });

    expect(urgentTasks.dueThisWeek.total).toBe(5);
    expect(urgentTasks.dueThisWeek.items).toHaveLength(5);
    expect(urgentTasks.dueThisWeek.items.map((task) => task.title)).toEqual([
      "Due This Week 1",
      "Due This Week 2",
      "Due This Week 3",
      "Due This Week 4",
      "Due This Week 5",
    ]);

    expect(urgentTasks.overdue.total).toBe(5);
    expect(urgentTasks.overdue.items).toHaveLength(2);
    expect(urgentTasks.overdue.items.map((task) => task.title)).toEqual([
      "Overdue 1",
      "Overdue 2",
    ]);
  });
});
