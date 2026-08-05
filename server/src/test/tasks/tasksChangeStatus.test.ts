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
import { createAuthCookie } from "@/test/helpers/testFactories";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("PATCH /tasks/:taskId/status", () => {
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
      .patch(`/tasks/${"taskid"}/status`)
      .set("Cookie", authCookie)
      .send({ wrongBody: "test" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid body" });
  });

  it("changes the taskStatus and synchronizes the projectStatus", async () => {
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

    const authCookie = await createAuthCookie(userId);

    const response = await request(app)
      .patch(`/tasks/${task._id.toString()}/status`)
      .set("Cookie", authCookie)
      .send({ taskStatus: "done" });

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      id: task._id.toString(),
      projectId: project._id.toString(),
      title: "Test Task",
      taskStatus: "done",
    });

    const updatedTask = await TaskModel.findById(task._id);
    const updatedProject = await ProjectModel.findById(project._id);

    if (!updatedTask) {
      throw new Error("Expected updated task to exist");
    }

    if (!updatedProject) {
      throw new Error("Expected updated project to exist");
    }

    expect(updatedTask.taskStatus).toBe("done");
    expect(updatedProject.projectStatus).toBe("done");
  });

  it("sets a pending project to in_progress when a task starts", async () => {
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
      projectStatus: "pending",
      dueDate: "2026-07-15",
    });

    const task = await TaskModel.create({
      workspaceId,
      projectId: project._id,
      title: "Test Task",
      dueDate: "2026-07-10",
      taskStatus: "pending",
      collaboratorIds: [userId],
      taskPriority: "high",
      tags: ["test"],
    });

    const authCookie = await createAuthCookie(userId);

    const response = await request(app)
      .patch(`/tasks/${task._id.toString()}/status`)
      .set("Cookie", authCookie)
      .send({ taskStatus: "in_progress" });

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      id: task._id.toString(),
      projectId: project._id.toString(),
      title: "Test Task",
      taskStatus: "in_progress",
    });

    const updatedProject = await ProjectModel.findById(project._id);

    if (!updatedProject) {
      throw new Error("Expected updated project to exist");
    }

    expect(updatedProject.projectStatus).toBe("in_progress");
  });

  it("returns 404 when the task does not exist", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();
    const taskId = new mongoose.Types.ObjectId();

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
      .patch(`/tasks/${taskId.toString()}/status`)
      .set("Cookie", authCookie)
      .send({ taskStatus: "done" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Task not found" });
  });

});
