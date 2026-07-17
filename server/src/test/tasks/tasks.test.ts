import app from "@/app";
import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import { UserModel } from "@/features/users/models/user.modal";
import mongoose from "mongoose";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model";
import { TaskModel } from "@/features/tasks/models/task.model";
import { ProjectModel } from "@/features/projects/models/project.model";
import { createAccessToken } from "@/features/auth/utils/tokens";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("GET /tasks", () => {
  it("returns 401 when the user is not authenticated", async () => {
    const response = await request(app).get("/tasks");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Not authenticated" });
  });

  it("returns an empty array when the authenticated user's workspace has no tasks", async () => {
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
      .get("/tasks")
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: [] });
  });

  it("returns tasks from the authenticated user's workspace", async () => {
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

    const task = await TaskModel.create({
      workspaceId,
      projectId: project._id.toString(),
      title: "Test Task",
      dueDate: "2026-07-10",
      taskStatus: "pending",
      collaboratorIds: [userId.toString()],
      taskPriority: "high",
      tags: ["test"],
    });

    const accessToken = createAccessToken(userId.toString());

    const response = await request(app)
      .get("/tasks")
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toMatchObject({
      id: task._id.toString(),
      projectId: project._id.toString(),
      title: "Test Task",
      taskStatus: "pending",
      taskPriority: "high",
      collaboratorIds: [userId.toString()],
    });
  });

  it("does not return tasks from another workspace", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();
    const otherWorkspaceId = new mongoose.Types.ObjectId();
    const otherOwnerId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create([
      {
        _id: workspaceId,
        name: "User Workspace",
        ownerId: userId,
      },
      {
        _id: otherWorkspaceId,
        name: "Other Workspace",
        ownerId: otherOwnerId,
      },
    ]);

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
      title: "Other Project",
      ownerId: otherOwnerId.toString(),
      priority: "medium",
      projectStatus: "pending",
      dueDate: "2026-07-20",
    });

    await TaskModel.create({
      workspaceId: otherWorkspaceId,
      projectId: otherProject._id.toString(),
      title: "Other Workspace Task",
      dueDate: "2026-07-18",
      taskStatus: "pending",
      collaboratorIds: [otherOwnerId.toString()],
      taskPriority: "medium",
    });

    const accessToken = createAccessToken(userId.toString());

    const response = await request(app)
      .get("/tasks")
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: [] });
  });
});
