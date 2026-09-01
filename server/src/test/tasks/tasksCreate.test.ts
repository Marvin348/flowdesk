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

import app from "@/app";
import request from "supertest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import { UserModel } from "@/features/users/models/user.modal";
import mongoose from "mongoose";
import { notificationQueue } from "@/queues/notificationQueue";
import { redisClient } from "@/shared/config/redis";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model";
import { TaskModel } from "@/features/tasks/models/task.model";
import { ProjectModel } from "@/features/projects/models/project.model";
import { createAuthCookie } from "@/test/helpers/testFactories";

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

describe("POST /tasks", () => {
  it("returns 400 if the body is invalid", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: userId,
    });

    await UserModel.create({
      _id: userId,
      email: "test@example.com",
      name: "Test User",
      passwordHash: "hashed-password",
      workspaceId,
      role: "admin",
      isEmailVerified: true,
    });

    const authCookie = await createAuthCookie(userId);

    const response = await request(app)
      .post("/tasks")
      .set("Cookie", authCookie)
      .send({ projectId: "false projectId", taskStatus: "false" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Missing required fields" });
  });

  it("creates a task in the authenticated user's workspace", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: userId,
    });

    await UserModel.create({
      _id: userId,
      email: "test@example.com",
      name: "Test User",
      passwordHash: "hashed-password",
      workspaceId,
      role: "admin",
      isEmailVerified: true,
    });

    const project = await ProjectModel.create({
      workspaceId,
      title: "Test Project",
      ownerId: userId.toString(),
      priority: "high",
      projectStatus: "in_progress",
      dueDate: "2026-07-15",
    });

    const authCookie = await createAuthCookie(userId);

    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockResolvedValue(undefined as never);
    
    const redisPublishMock = vi.mocked(redisClient.publish);
    redisPublishMock.mockResolvedValue(1 as never);

    const response = await request(app)
      .post("/tasks")
      .set("Cookie", authCookie)
      .send({
        projectId: project._id.toString(),
        title: "Create task tests",
        collaboratorIds: [userId.toString()],
        dueDate: "2026-07-10",
        tags: ["test"],
        taskPriority: "high",
        description: "Cover the task creation route",
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toMatchObject({
      projectId: project._id.toString(),
      title: "Create task tests",
      collaboratorIds: [userId.toString()],
      dueDate: new Date("2026-07-10").toISOString(),
      taskStatus: "pending",
      taskPriority: "high",
      description: "Cover the task creation route",
      tags: ["test"],
    });

    const createdTask = await TaskModel.findById(response.body.data.id);

    if (!createdTask) {
      throw new Error("Expected created task to exist");
    }

    expect(createdTask.workspaceId.toString()).toBe(workspaceId.toString());
    expect(createdTask.projectId.toString()).toBe(project._id.toString());
    expect(createdTask.dueDate).toEqual(new Date("2026-07-10"));
    expect(createdTask.taskStatus).toBe("pending");

    expect(queueAddMock).toHaveBeenCalledOnce();
    expect(queueAddMock).toHaveBeenCalledWith("task-assigned", {
      actorId: userId.toString(),
      workspaceId: workspaceId.toString(),
      taskId: response.body.data.id,
      projectId: project._id.toString(),
      collaboratorIds: [userId.toString()],
    });

    expect(redisPublishMock).toHaveBeenCalledOnce();
    expect(redisPublishMock).toHaveBeenCalledWith(
      "realtime-tasks",
      JSON.stringify({
        projectId: project._id.toString(),
        type: "task:created",
      }),
    );
  });

  it("returns 404 when the project belongs to another workspace", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();
    const otherWorkspaceId = new mongoose.Types.ObjectId();
    const otherOwnerId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: userId,
    });

    await UserModel.create({
      _id: userId,
      email: "test@example.com",
      name: "Test User",
      passwordHash: "hashed-password",
      workspaceId,
      role: "admin",
      isEmailVerified: true,
    });

    const otherProject = await ProjectModel.create({
      workspaceId: otherWorkspaceId,
      title: "Other Workspace Project",
      ownerId: otherOwnerId.toString(),
      priority: "medium",
      projectStatus: "pending",
      dueDate: "2026-07-20",
    });

    const authCookie = await createAuthCookie(userId);

    const response = await request(app)
      .post("/tasks")
      .set("Cookie", authCookie)
      .send({
        projectId: otherProject._id.toString(),
        title: "Forbidden workspace task",
        collaboratorIds: [userId.toString()],
        dueDate: "2026-07-10",
        taskPriority: "high",
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Project not found" });
    expect(await TaskModel.countDocuments()).toBe(0);
  });

  it("returns 400 when a collaborator belongs to another workspace", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();
    const otherWorkspaceId = new mongoose.Types.ObjectId();
    const otherUserId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create([
      {
        _id: workspaceId,
        name: "Test Workspace",
        ownerId: userId,
      },
      {
        _id: otherWorkspaceId,
        name: "Other Workspace",
        ownerId: otherUserId,
      },
    ]);

    await UserModel.create([
      {
        _id: userId,
        email: "test@example.com",
        name: "Test User",
        passwordHash: "hashed-password",
        workspaceId,
        role: "admin",
        isEmailVerified: true,
      },
      {
        _id: otherUserId,
        email: "other@example.com",
        name: "Other User",
        passwordHash: "hashed-password",
        workspaceId: otherWorkspaceId,
        role: "member",
        isEmailVerified: true,
      },
    ]);

    const project = await ProjectModel.create({
      workspaceId,
      title: "Test Project",
      ownerId: userId.toString(),
      priority: "high",
      projectStatus: "in_progress",
      dueDate: "2026-07-15",
    });

    const authCookie = await createAuthCookie(userId);

    const response = await request(app)
      .post("/tasks")
      .set("Cookie", authCookie)
      .send({
        projectId: project._id.toString(),
        title: "Invalid collaborator task",
        collaboratorIds: [otherUserId.toString()],
        dueDate: "2026-07-10",
        taskPriority: "high",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "One or more users are invalid",
    });
    expect(await TaskModel.countDocuments()).toBe(0);
  });
});
