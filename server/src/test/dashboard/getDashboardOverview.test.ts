import app from "@/app";
import request from "supertest";
import {
  beforeAll,
  beforeEach,
  afterAll,
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
import { createAuthedUserContext } from "@/test/helpers/testFactories";
import { createTask, createProject } from "@/test/helpers/testFactories";

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

describe("GET /dashboard", () => {
  it("returns 401 if the user is not authenticated", async () => {
    const response = await request(app).get("/dashboard");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Not authenticated" });
  });

  it("retuns empty authenticated dashboard", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .get("/dashboard")
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      overviewStats: {
        activeProjects: 0,
        openTasks: 0,
        overdueTasks: 0,
        tasksDueThisWeek: 0,
      },
      urgentTasks: {
        dueThisWeek: {
          total: 0,
          items: [],
        },
        overdue: {
          total: 0,
          items: [],
        },
      },
      attentionRequired: {
        mostOverdueProject: null,
        deadlineRisk: null,
        lowProgressRisk: null,
      },
      taskStatusDistribution: {
        pending: 0,
        in_progress: 0,
        done: 0,
      },
    });
  });

  it("returns dashboard", async () => {
    const { authCookie, workspaceId } = await createAuthedUserContext();

    const project = await createProject({
      workspaceId,
      title: "Dashboard Project",
    });

    await createTask({
      workspaceId,
      projectId: project._id,
      title: "Due Today",
      taskStatus: "pending",
      taskPriority: "high",
      dueDate: new Date(2026, 7, 5, 14),
    });

    await createTask({
      workspaceId,
      projectId: project._id,
      title: "Overdue",
      taskStatus: "in_progress",
      taskPriority: "medium",
      dueDate: new Date(2026, 7, 4, 10),
    });

    await createTask({
      workspaceId,
      projectId: project._id,
      title: "Due Sunday",
      taskStatus: "pending",
      taskPriority: "low",
      dueDate: new Date(2026, 7, 9, 10),
    });

    const response = await request(app)
      .get("/dashboard")
      .set("Cookie", authCookie);

    expect(response.body.data.urgentTasks.dueThisWeek.total).toBe(2);
    expect(response.body.data.urgentTasks.overdue.total).toBe(1);
    expect(response.body.data.overviewStats).toMatchObject({
      activeProjects: 1,
      openTasks: 3,
      overdueTasks: 1,
      tasksDueThisWeek: 2,
    });
  });
});
