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
import { createAccessToken } from "@/features/auth/utils/tokens";
import { TaskModel } from "@/features/tasks/models/task.model";
import { ProjectModel } from "@/features/projects/models/project.model";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("GET /users/:id/details", () => {
  it("returns 400 if the param is Invalid", async () => {
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
      .get("/users/invalid-id/details")
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(400);
  });

  it("returns 200 if userId is valid", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();
    const projectId = new mongoose.Types.ObjectId();
    const pendingTaskId = new mongoose.Types.ObjectId();
    const inProgressTaskId = new mongoose.Types.ObjectId();
    const completedTaskId = new mongoose.Types.ObjectId();

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
      jobTitle: "Developer",
      isEmailVerified: true,
    });

    await ProjectModel.create({
      _id: projectId,
      workspaceId,
      title: "Test Project",
      ownerId: userId.toString(),
      priority: "high",
      projectStatus: "in_progress",
      dueDate: "2026-07-31",
      invitedUserIds: [userId],
    });

    await TaskModel.create([
      {
        _id: pendingTaskId,
        workspaceId,
        projectId,
        title: "Next pending task",
        dueDate: "2026-07-10",
        taskStatus: "pending",
        collaboratorIds: [userId],
        taskPriority: "high",
      },
      {
        _id: inProgressTaskId,
        workspaceId,
        projectId,
        title: "In-progress task",
        dueDate: "2026-07-20",
        taskStatus: "in_progress",
        collaboratorIds: [userId],
        taskPriority: "medium",
      },
      {
        _id: completedTaskId,
        workspaceId,
        projectId,
        title: "Recently completed task",
        dueDate: "2026-07-05",
        completedAt: "2026-07-04T10:00:00.000Z",
        taskStatus: "done",
        collaboratorIds: [userId],
        taskPriority: "low",
      },
    ]);

    const accessToken = createAccessToken(userId.toString());

    const response = await request(app)
      .get(`/users/${userId}/details`)
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      user: {
        id: userId.toString(),
        name: "Test User",
        email: "test@example.com",
        role: "admin",
        jobTitle: "Developer",
      },
      invitedProjects: [
        {
          id: projectId.toString(),
          title: "Test Project",
          priority: "high",
          projectStatus: "in_progress",
        },
      ],
      stats: {
        pendingCount: 1,
        inProgressCount: 1,
        completedCount: 1,
      },
      recentCompletedTask: {
        id: completedTaskId.toString(),
        title: "Recently completed task",
        completedAt: "2026-07-04T10:00:00.000Z",
      },
      nextDueTask: {
        id: pendingTaskId.toString(),
        title: "Next pending task",
        dueDate: new Date("2026-07-10").toISOString(),
      },
    });
  });
});
