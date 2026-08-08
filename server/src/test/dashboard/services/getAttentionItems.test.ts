import { getDashboardAttentionItems } from "@/features/dashboard/services/dashboardAttentionItems.service";
import {
  afterAll,
  beforeAll,
  beforeEach,
  afterEach,
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
import { createProjectTasks } from "@/test/helpers/createProjectTasks";


beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 7, 8, 10));
  await clearTestDb();
});

afterEach(() => {
  vi.useRealTimers();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("getDashboardAttentionItems", () => {
  it("returns null when nothing is critical", async () => {
    const { workspaceId } = await createAuthedUserContext();

    const project = await createProject({
      workspaceId,
      dueDate: new Date(2026, 9, 20),
    });

    await createTask({
      workspaceId,
      projectId: project._id,
      taskStatus: "pending",
      dueDate: new Date(2026, 8, 20),
    });

    await createTask({
      workspaceId,
      projectId: project._id,
      taskStatus: "pending",
      dueDate: new Date(2026, 8, 20),
    });

    await createTask({
      workspaceId,
      projectId: project._id,
      taskStatus: "in_progress",
      dueDate: new Date(2026, 8, 20),
    });

    await createTask({
      workspaceId,
      projectId: project._id,
      taskStatus: "done",
      dueDate: new Date(2026, 7, 10),
    });

    const attentionItems = await getDashboardAttentionItems({ workspaceId });

    expect(attentionItems).toEqual({
      mostOverdueProject: null,
      deadlineRisk: null,
      lowProgressRisk: null,
    });
  });

  it("returns mostOverdueProject", async () => {
    const { workspaceId } = await createAuthedUserContext();

    const project = await createProject({
      workspaceId,
      title: "Test Project",
      projectStatus: "pending",
      dueDate: new Date(2026, 7, 5),
    });

    await createTask({
      workspaceId,
      projectId: project._id,
      taskStatus: "pending",
      dueDate: new Date(2026, 8, 20),
    });

    await createTask({
      workspaceId,
      projectId: project._id,
      taskStatus: "in_progress",
      dueDate: new Date(2026, 8, 20),
    });

    const attentionItems = await getDashboardAttentionItems({ workspaceId });

    expect(attentionItems).toEqual({
      mostOverdueProject: {
        id: project._id.toString(),
        title: "Test Project",
        type: "most_overdue",
        dueDate: toIsoString(project.dueDate),
        projectStatus: "pending",
        daysRemaining: -3,
      },
      deadlineRisk: null,
      lowProgressRisk: null,
    });
  });

  it("returns deadlineRisk", async () => {
    const { workspaceId } = await createAuthedUserContext();

    const project = await createProject({
      workspaceId,
      title: "Deadline Risk Project",
      projectStatus: "in_progress",
      dueDate: new Date(2026, 7, 12),
    });

    await createProjectTasks({
      workspaceId,
      projectId: project._id,
      openTasks: 3,
      doneTasks: 1,
    });

    const attentionItems = await getDashboardAttentionItems({ workspaceId });

    expect(attentionItems).toEqual({
      mostOverdueProject: null,
      deadlineRisk: {
        id: project._id.toString(),
        title: "Deadline Risk Project",
        type: "deadline_risk",
        dueDate: toIsoString(project.dueDate),
        projectStatus: "in_progress",
        daysRemaining: 4,
        completionRate: 25,
        openTaskCount: 3,
      },
      lowProgressRisk: null,
    });
  });

  it("returns lowProgressRisk", async () => {
    const { workspaceId } = await createAuthedUserContext();

    const project = await createProject({
      workspaceId,
      title: "Low Progress Project",
      projectStatus: "in_progress",
      dueDate: new Date(2026, 7, 20),
    });

    await createProjectTasks({
      workspaceId,
      projectId: project._id,
      openTasks: 5,
      doneTasks: 1,
    });

    const attentionItems = await getDashboardAttentionItems({ workspaceId });

    expect(attentionItems).toEqual({
      mostOverdueProject: null,
      deadlineRisk: null,
      lowProgressRisk: {
        id: project._id.toString(),
        title: "Low Progress Project",
        type: "low_progress_risk",
        projectStatus: "in_progress",
        daysRemaining: 12,
        completionRate: 17,
        openTaskCount: 5,
      },
    });
  });

  it("selects the strongest candidate for each attention slot", async () => {
    const { workspaceId } = await createAuthedUserContext();

    const lessOverdueProject = await createProject({
      workspaceId,
      title: "Less Overdue Project",
      projectStatus: "pending",
      dueDate: new Date(2026, 7, 5),
    });

    await createProjectTasks({
      workspaceId,
      projectId: lessOverdueProject._id,
      openTasks: 2,
      doneTasks: 0,
    });

    const mostOverdueProject = await createProject({
      workspaceId,
      title: "Most Overdue Project",
      projectStatus: "in_progress",
      dueDate: new Date(2026, 7, 3),
    });

    await createProjectTasks({
      workspaceId,
      projectId: mostOverdueProject._id,
      openTasks: 2,
      doneTasks: 0,
    });

    const weakerDeadlineRisk = await createProject({
      workspaceId,
      title: "Weaker Deadline Risk",
      projectStatus: "in_progress",
      dueDate: new Date(2026, 7, 14),
    });

    await createProjectTasks({
      workspaceId,
      projectId: weakerDeadlineRisk._id,
      openTasks: 5,
      doneTasks: 0,
    });

    const strongestDeadlineRisk = await createProject({
      workspaceId,
      title: "Strongest Deadline Risk",
      projectStatus: "in_progress",
      dueDate: new Date(2026, 7, 10),
    });

    await createProjectTasks({
      workspaceId,
      projectId: strongestDeadlineRisk._id,
      openTasks: 3,
      doneTasks: 2,
    });

    const weakerLowProgressRisk = await createProject({
      workspaceId,
      title: "Weaker Low Progress Risk",
      projectStatus: "pending",
      dueDate: new Date(2026, 7, 18),
    });

    await createProjectTasks({
      workspaceId,
      projectId: weakerLowProgressRisk._id,
      openTasks: 5,
      doneTasks: 1,
    });

    const strongestLowProgressRisk = await createProject({
      workspaceId,
      title: "Strongest Low Progress Risk",
      projectStatus: "in_progress",
      dueDate: new Date(2026, 7, 25),
    });

    await createProjectTasks({
      workspaceId,
      projectId: strongestLowProgressRisk._id,
      openTasks: 6,
      doneTasks: 0,
    });

    const attentionItems = await getDashboardAttentionItems({ workspaceId });

    expect(attentionItems.mostOverdueProject).toEqual(
      expect.objectContaining({
        id: mostOverdueProject._id.toString(),
        daysRemaining: -5,
      }),
    );
    expect(attentionItems.deadlineRisk).toEqual(
      expect.objectContaining({
        id: strongestDeadlineRisk._id.toString(),
        daysRemaining: 2,
        completionRate: 40,
      }),
    );
    expect(attentionItems.lowProgressRisk).toEqual(
      expect.objectContaining({
        id: strongestLowProgressRisk._id.toString(),
        daysRemaining: 17,
        completionRate: 0,
        openTaskCount: 6,
      }),
    );
  });

  it("ignores done projects and projects from other workspaces", async () => {
    const { workspaceId } = await createAuthedUserContext();
    const otherWorkspaceId = new mongoose.Types.ObjectId();

    const doneProject = await createProject({
      workspaceId,
      title: "Done Overdue Project",
      projectStatus: "done",
      dueDate: new Date(2026, 7, 1),
    });

    await createProjectTasks({
      workspaceId,
      projectId: doneProject._id,
      openTasks: 10,
      doneTasks: 0,
    });

    const otherWorkspaceProject = await createProject({
      workspaceId: otherWorkspaceId,
      title: "Other Workspace Risk",
      projectStatus: "in_progress",
      dueDate: new Date(2026, 7, 1),
    });

    await createProjectTasks({
      workspaceId: otherWorkspaceId,
      projectId: otherWorkspaceProject._id,
      openTasks: 10,
      doneTasks: 0,
    });

    const attentionItems = await getDashboardAttentionItems({ workspaceId });

    expect(attentionItems).toEqual({
      mostOverdueProject: null,
      deadlineRisk: null,
      lowProgressRisk: null,
    });
  });
});
