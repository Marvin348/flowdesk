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

describe("DELETE /projects/:projectId/members/:userId", () => {
  it("returns 400 if the params are invalid", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .delete("/projects/:projectId/members/:userId")
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid params" });
  });

  it("returns 403 if the user is not a admin", async () => {
    const { authCookie, userId } = await createAuthedUserContext({
      role: "member",
    });
    const projectId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/projects/${projectId}/members/${userId}`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: "Only admins can delete user" });
  });

  it("returns 404 if the project does not exist", async () => {
    const { authCookie, userId } = await createAuthedUserContext();
    const missingProjectId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/projects/${missingProjectId.toString()}/members/${userId}`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Project not found" });
  });

  it("returns 400 if the user is not a project member", async () => {
    const { authCookie, workspaceId, userId } = await createAuthedUserContext();
    const otherUserId = new mongoose.Types.ObjectId();

    const project = await createProject({
      workspaceId,
      invitedUserIds: [otherUserId],
    });

    const response = await request(app)
      .delete(`/projects/${project._id.toString()}/members/${userId}`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "User is not a project member" });
  });

  it("removes the member from the project and cleans up orphaned task data", async () => {
    const { authCookie, workspaceId, userId } = await createAuthedUserContext();
    const remainingUserId = new mongoose.Types.ObjectId();

    const project = await createProject({
      workspaceId,
      invitedUserIds: [userId, remainingUserId],
    });

    const soloTask = await createTask({
      workspaceId,
      projectId: project._id,
      collaboratorIds: [userId],
    });
    const sharedTask = await createTask({
      workspaceId,
      projectId: project._id,
      collaboratorIds: [userId, remainingUserId],
    });

    const soloTaskAttachment = await createAttachment({
      workspaceId,
      projectId: project._id,
      taskId: soloTask._id,
      userId,
    });
    const sharedTaskAttachment = await createAttachment({
      workspaceId,
      projectId: project._id,
      taskId: sharedTask._id,
      userId,
    });
    const projectAttachment = await createAttachment({
      workspaceId,
      projectId: project._id,
      taskId: null,
      userId,
    });

    const soloTaskComment = await createComment({
      workspaceId,
      taskId: soloTask._id,
      userId,
    });
    const sharedTaskComment = await createComment({
      workspaceId,
      taskId: sharedTask._id,
      userId,
    });

    const response = await request(app)
      .delete(`/projects/${project._id.toString()}/members/${userId}`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "User deleted successfully" });

    const updatedProject = await ProjectModel.findById(project._id).lean();
    expect(updatedProject).not.toBeNull();
    expect(updatedProject?.invitedUserIds.map((id) => id.toString())).toEqual([
      remainingUserId.toString(),
    ]);

    await expect(TaskModel.findById(soloTask._id)).resolves.toBeNull();
    await expect(
      AttachmentModel.findById(soloTaskAttachment._id),
    ).resolves.toBeNull();
    await expect(CommentModel.findById(soloTaskComment._id)).resolves.toBeNull();

    const updatedSharedTask = await TaskModel.findById(sharedTask._id).lean();
    expect(updatedSharedTask).not.toBeNull();
    expect(updatedSharedTask?.collaboratorIds.map((id) => id.toString())).toEqual(
      [remainingUserId.toString()],
    );
    await expect(
      AttachmentModel.findById(sharedTaskAttachment._id),
    ).resolves.not.toBeNull();
    await expect(
      CommentModel.findById(sharedTaskComment._id),
    ).resolves.not.toBeNull();
    await expect(ProjectModel.findById(project._id)).resolves.not.toBeNull();
    await expect(
      AttachmentModel.findById(projectAttachment._id),
    ).resolves.not.toBeNull();
  });
});
