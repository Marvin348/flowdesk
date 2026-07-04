import app from "@/app.js";
import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import mongoose from "mongoose";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { createAccessToken } from "@/features/auth/utils/tokens.js";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
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

    const accessToken = createAccessToken(userId.toString());

    const response = await request(app)
      .post("/tasks")
      .set("Cookie", [`accessToken=${accessToken}`])
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

    const accessToken = createAccessToken(userId.toString());

    const response = await request(app)
      .post("/tasks")
      .set("Cookie", [`accessToken=${accessToken}`])
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
      dueDate: "2026-07-10",
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
    expect(createdTask.taskStatus).toBe("pending");
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

    const accessToken = createAccessToken(userId.toString());

    const response = await request(app)
      .post("/tasks")
      .set("Cookie", [`accessToken=${accessToken}`])
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

    const accessToken = createAccessToken(userId.toString());

    const response = await request(app)
      .post("/tasks")
      .set("Cookie", [`accessToken=${accessToken}`])
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
