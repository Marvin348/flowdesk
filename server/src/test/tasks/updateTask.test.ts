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

import app from "@/app";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import request from "supertest";
import {
  createAuthedUserContext,
  createTask,
  createUser,
} from "@/test/helpers/testFactories";
import mongoose from "mongoose";
import { TaskModel } from "@/features/tasks/models/task.model";
import { notificationQueue } from "@/queues/notificationQueue";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterEach(() => {
  vi.restoreAllMocks();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("PATCH /tasks/:taskId", () => {
  it("returns 400 if the taskId is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .patch(`/tasks/invalid-id`)
      .send({ title: "Updated task" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid taskId" });
  });

  it("returns 400 if the body is invalid", async () => {
    const { authCookie, workspaceId } = await createAuthedUserContext();
    const task = await createTask({ workspaceId });

    const response = await request(app)
      .patch(`/tasks/${task._id.toString()}`)
      .send({ title: "no" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid body" });
  });

  it("returns 404 if the task was not found", async () => {
    const { authCookie } = await createAuthedUserContext();
    const invalidTaskId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .patch(`/tasks/${invalidTaskId}`)
      .send({ title: "Updated task" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Task not found" });
  });

  it("updates the matching task", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();
    const projectId = new mongoose.Types.ObjectId();
    const newCollaborator = await createUser({
      workspaceId,
      role: "member",
    });

    const task = await createTask({
      workspaceId,
      projectId,
      title: "Original task",
      dueDate: "2026-07-10",
      taskStatus: "pending",
      collaboratorIds: [userId],
      taskPriority: "medium",
      description: "Original description",
      tags: ["old"],
    });
    
    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);

    const response = await request(app)
      .patch(`/tasks/${task._id.toString()}`)
      .send({
        title: "Updated task",
        dueDate: "2026-07-20",
        collaboratorIds: [newCollaborator._id.toString()],
        taskPriority: "high",
        description: "Updated description",
        tags: ["new", "api"],
      })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.updatedTask).toMatchObject({
      id: task._id.toString(),
      projectId: projectId.toString(),
      title: "Updated task",
      dueDate: new Date("2026-07-20").toISOString(),
      taskStatus: "pending",
      collaboratorIds: [newCollaborator._id.toString()],
      taskPriority: "high",
      description: "Updated description",
      tags: ["new", "api"],
    });

    const updatedTask = await TaskModel.findById(task._id);

    if (!updatedTask) {
      throw new Error("Expected updated task to exist");
    }

    expect(updatedTask.title).toBe("Updated task");
    expect(updatedTask.dueDate).toEqual(new Date("2026-07-20"));
    expect(updatedTask.taskPriority).toBe("high");
    expect(updatedTask.description).toBe("Updated description");
    expect(updatedTask.tags).toEqual(["new", "api"]);

    expect(queueAddMock).toHaveBeenCalledOnce();
    expect(queueAddMock).toHaveBeenCalledWith("task-updated", {
      actorId: userId.toString(),
      workspaceId: workspaceId.toString(),
      taskId: task._id.toString(),
      previousCollaboratorIds: [userId.toString()],
      projectId: projectId.toString(),
      currentCollaboratorIds: [newCollaborator._id.toString()],
    });
  });
});
