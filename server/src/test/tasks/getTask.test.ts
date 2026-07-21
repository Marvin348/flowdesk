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

describe("GET /tasks/:taskId", () => {
  it("returns 400 if invalid taskId", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .get(`/tasks/invalid-id`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid taskId" });
  });

  it("returns 404 if the task was not found", async () => {
    const { authCookie } = await createAuthedUserContext();
    const invalidTaskId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/tasks/${invalidTaskId}`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Task not found" });
  });

  it("returns the matching task", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();
    const projectId = new mongoose.Types.ObjectId();

    const task = await createTask({
      workspaceId,
      projectId,
      title: "task-demo",
      dueDate: "2026-07-10",
      taskStatus: "in_progress",
      collaboratorIds: [userId],
      taskPriority: "high",
      description: "Details for the selected task",
      tags: ["demo", "api"],
    });

    const response = await request(app)
      .get(`/tasks/${task._id.toString()}`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.task).toMatchObject({
      id: task._id.toString(),
      projectId: projectId.toString(),
      title: "task-demo",
      dueDate: new Date("2026-07-10").toISOString(),
      taskStatus: "in_progress",
      collaboratorIds: [userId.toString()],
      taskPriority: "high",
      description: "Details for the selected task",
      tags: ["demo", "api"],
    });
  });
});
