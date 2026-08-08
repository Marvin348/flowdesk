import { getTaskStatusDistribution } from "@/features/dashboard/services/dashboardTaskStatusDistribution.service";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
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
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("getTaskStatusDistribution", () => {
  it("returns zero percentages when the workspace has no tasks", async () => {
    const { workspaceId } = await createAuthedUserContext();

    const distribution = await getTaskStatusDistribution({ workspaceId });

    expect(distribution).toEqual({
      pending: 0,
      in_progress: 0,
      done: 0,
    });
  });

  it("returns task status percentages for the workspace", async () => {
    const { workspaceId } = await createAuthedUserContext();
    const otherWorkspaceId = new mongoose.Types.ObjectId();
    const project = await createProject({ workspaceId });

    await createTask({
      workspaceId,
      projectId: project._id,
      taskStatus: "pending",
    });

    await createTask({
      workspaceId,
      projectId: project._id,
      taskStatus: "pending",
    });

    await createTask({
      workspaceId,
      projectId: project._id,
      taskStatus: "in_progress",
    });

    await createTask({
      workspaceId,
      projectId: project._id,
      taskStatus: "done",
    });

    await createTask({
      workspaceId: otherWorkspaceId,
      taskStatus: "done",
    });

    const distribution = await getTaskStatusDistribution({ workspaceId });

    expect(distribution).toEqual({
      pending: 50,
      in_progress: 25,
      done: 25,
    });
  });
});
