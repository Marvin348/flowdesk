import app from "@/app.js";
import { AttachmentModel } from "@/features/attachments/models/attachment.model.js";
import { CommentModel } from "@/features/comments/models/comment.model.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb.js";
import request from "supertest";
import {
  createAttachment,
  createAuthedUserContext,
  createComment,
  createProject,
  createTask,
} from "@/test/helpers/testFactories.js";
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

describe("DELETE /projects/:id", () => {
  it("returns 400 if invalid projectId", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .delete("/projects/invalid-projectId")
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid projectId" });
  });

  it("returns 404 if the project was not found", async () => {
    const { authCookie } = await createAuthedUserContext();
    const missingProjectId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/projects/${missingProjectId}`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Project not found" });
  });

  it("returns 403 if the user is not a admin", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext({
      role: "member",
    });

    const project = await createProject({
      workspaceId,
      ownerId: userId.toString(),
    });

    const response = await request(app)
      .delete(`/projects/${project._id.toString()}`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Only admins can delete projects",
    });

    const existingProject = await ProjectModel.findById(project._id);
    expect(existingProject).not.toBeNull();
  });

  it("deletes a project with its tasks, comments, and attachments", async () => {
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();
    const project = await createProject({
      workspaceId,
      ownerId: userId.toString(),
    });
    const task = await createTask({
      workspaceId,
      projectId: project._id,
      collaboratorIds: [userId],
    });

    await createComment({
      workspaceId,
      taskId: task._id,
      userId,
    });
    await createAttachment({
      workspaceId,
      projectId: project._id,
      taskId: task._id,
      userId,
    });

    const response = await request(app)
      .delete(`/projects/${project._id.toString()}`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        id: project._id.toString(),
      },
    });

    const deletedProject = await ProjectModel.findById(project._id);
    const deletedTask = await TaskModel.findById(task._id);
    const deletedComments = await CommentModel.find({ taskId: task._id });
    const deletedAttachments = await AttachmentModel.find({
      projectId: project._id,
    });

    expect(deletedProject).toBeNull();
    expect(deletedTask).toBeNull();
    expect(deletedComments).toHaveLength(0);
    expect(deletedAttachments).toHaveLength(0);
  });
});
