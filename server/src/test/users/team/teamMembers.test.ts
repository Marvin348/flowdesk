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

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("GET /users/team", () => {
  it("returns 401 when user is not authenticated", async () => {
    const response = await request(app)
      .get("/users/me/team")
      .send({ email: "member@example.com" });

    expect(response.status).toBe(401);
  });

  it("returns 400 if the query is invalid", async () => {
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
      .get("/users/team")
      .query({ page: "fake-query" })
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid query params" });
  });

  it("returns team members with task stats and pagination", async () => {
    const workspaceId = new mongoose.Types.ObjectId();
    const adminId = new mongoose.Types.ObjectId();
    const memberId = new mongoose.Types.ObjectId();
    const projectId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: adminId,
    });

    await UserModel.create([
      {
        _id: adminId,
        email: "alice@example.com",
        name: "Alice",
        passwordHash: "hashed-password",
        workspaceId,
        role: "admin",
        isEmailVerified: true,
      },
      {
        _id: memberId,
        email: "bob@example.com",
        name: "Bob",
        passwordHash: "hashed-password",
        workspaceId,
        role: "member",
        isEmailVerified: true,
      },
    ]);

    await TaskModel.create([
      {
        workspaceId,
        projectId,
        title: "Completed task",
        dueDate: "2026-07-10",
        taskStatus: "done",
        collaboratorIds: [adminId],
        taskPriority: "high",
      },
      {
        workspaceId,
        projectId,
        title: "Open shared task",
        dueDate: "2026-07-11",
        taskStatus: "pending",
        collaboratorIds: [adminId, memberId],
        taskPriority: "medium",
      },
    ]);

    const accessToken = createAccessToken(adminId.toString());

    const response = await request(app)
      .get("/users/team")
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(200);
    expect(response.body.data.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
    });

    expect(response.body.data.items).toEqual([
      {
        id: adminId.toString(),
        name: "Alice",
        email: "alice@example.com",
        role: "admin",
        stats: {
          completedCount: 1,
          openTasks: 1,
          progressPercent: 50,
          tasksCount: 2,
        },
      },
      {
        id: memberId.toString(),
        name: "Bob",
        email: "bob@example.com",
        role: "member",
        stats: {
          completedCount: 0,
          openTasks: 1,
          progressPercent: 0,
          tasksCount: 1,
        },
      },
    ]);
  });

  it("applies search and team filters from the query", async () => {
    const workspaceId = new mongoose.Types.ObjectId();
    const adminId = new mongoose.Types.ObjectId();
    const activeMemberId = new mongoose.Types.ObjectId();
    const freeMemberId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: adminId,
    });

    await UserModel.create([
      {
        _id: adminId,
        email: "alice@example.com",
        name: "Alice",
        passwordHash: "hashed-password",
        workspaceId,
        role: "admin",
        isEmailVerified: true,
      },
      {
        _id: activeMemberId,
        email: "bob@example.com",
        name: "Bob",
        passwordHash: "hashed-password",
        workspaceId,
        role: "member",
        isEmailVerified: true,
      },
      {
        _id: freeMemberId,
        email: "bobby@example.com",
        name: "Bobby",
        passwordHash: "hashed-password",
        workspaceId,
        role: "member",
        isEmailVerified: true,
      },
    ]);

    await TaskModel.create({
      workspaceId,
      projectId: new mongoose.Types.ObjectId(),
      title: "Bob's open task",
      dueDate: "2026-07-12",
      taskStatus: "pending",
      collaboratorIds: [activeMemberId],
      taskPriority: "medium",
    });

    const accessToken = createAccessToken(adminId.toString());

    const response = await request(app)
      .get("/users/team")
      .query({
        search: "bo",
        role: "member",
        activity: "active",
        progress: "critical",
        sort: "openTasks_desc",
        page: 1,
        limit: 10,
      })
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(200);
    expect(response.body.data.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
    });
    expect(response.body.data.items).toEqual([
      {
        id: activeMemberId.toString(),
        name: "Bob",
        email: "bob@example.com",
        role: "member",
        stats: {
          completedCount: 0,
          openTasks: 1,
          progressPercent: 0,
          tasksCount: 1,
        },
      },
    ]);
  });
});
