import app from "@/app";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import request from "supertest";
import {
  createAuthedUserContext,
  createProject,
  createTask,
  createUser,
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

describe("GET /projects/:projectId/tasks", () => {
  it("returns 400 if the projectId is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .get(`/projects/invalid-id/tasks`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid projectId" });
  });

  it("returns 400 if the query is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();
    const projectId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/projects/${projectId}/tasks`)
      .query({ test: "invalid-query" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid query" });
  });

  it("returns tasks by status", async () => {
    const { authCookie, workspaceId } = await createAuthedUserContext();
    const projectId = new mongoose.Types.ObjectId();

    await createProject({
      _id: projectId,
      workspaceId,
    });

    const collaborator = await createUser({
      workspaceId,
      name: "Task Collaborator",
      avatarStorageKey: "avatars/task-collaborator.png",
    });

    await createTask({
      workspaceId,
      projectId,
      title: "Skipped pending task",
      dueDate: "2026-07-18",
      taskStatus: "pending",
      taskPriority: "low",
    });

    const firstReturnedTask = await createTask({
      workspaceId,
      projectId,
      title: "First returned pending task",
      dueDate: "2026-07-19",
      taskStatus: "pending",
      taskPriority: "high",
      tags: ["planning"],
      collaboratorIds: [collaborator._id],
    });

    const secondReturnedTask = await createTask({
      workspaceId,
      projectId,
      title: "Second returned pending task",
      dueDate: "2026-07-20",
      taskStatus: "pending",
      taskPriority: "medium",
    });

    await createTask({
      workspaceId,
      projectId,
      title: "Different status task",
      dueDate: "2026-07-17",
      taskStatus: "done",
      taskPriority: "medium",
    });

    await createTask({
      workspaceId,
      projectId: new mongoose.Types.ObjectId(),
      title: "Different project task",
      dueDate: "2026-07-17",
      taskStatus: "pending",
      taskPriority: "medium",
    });

    const response = await request(app)
      .get(`/projects/${projectId}/tasks`)
      .query({
        taskStatus: "pending",
        limit: 2,
        offset: 1,
      })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([
      {
        id: firstReturnedTask._id.toString(),
        projectId: projectId.toString(),
        title: "First returned pending task",
        dueDate: new Date("2026-07-19").toISOString(),
        taskStatus: "pending",
        taskPriority: "high",
        tags: ["planning"],
        reminderAt: "",
        completedAt: "",
        collaborators: [
          {
            id: collaborator._id.toString(),
            avatarUrl: "https://public-r2.test/avatars/task-collaborator.png",
          },
        ],
      },
      {
        id: secondReturnedTask._id.toString(),
        projectId: projectId.toString(),
        title: "Second returned pending task",
        dueDate: new Date("2026-07-20").toISOString(),
        taskStatus: "pending",
        taskPriority: "medium",
        tags: [],
        reminderAt: "",
        completedAt: "",
        collaborators: [],
      },
    ]);
  });
});
