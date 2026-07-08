import app from "@/app.js";
import { AttachmentModel } from "@/features/attachments/models/attachment.model.js";
import { CommentModel } from "@/features/comments/models/comment.model.js";
import { createAccessToken } from "@/features/auth/utils/tokens.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model.js";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb.js";
import mongoose from "mongoose";
import request from "supertest";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

const createAuthedProjectContext = async () => {
  const userId = new mongoose.Types.ObjectId();
  const workspaceId = new mongoose.Types.ObjectId();
  const invitedUserId = new mongoose.Types.ObjectId();

  await WorkspaceModel.create({
    _id: workspaceId,
    name: "Test Workspace",
    ownerId: userId,
  });

  const user = await UserModel.create({
    _id: userId,
    email: "test@example.com",
    name: "Test User",
    passwordHash: "hashed-password",
    workspaceId,
    role: "admin",
    isEmailVerified: true,
  });

  const invitedUser = await UserModel.create({
    _id: invitedUserId,
    email: "member@example.com",
    name: "Project Member",
    passwordHash: "hashed-password",
    workspaceId,
    role: "member",
    isEmailVerified: true,
    avatarStorageKey: "avatars/member.jpg",
  });

  const project = await ProjectModel.create({
    workspaceId,
    title: "Test Project",
    description: "A project for endpoint tests",
    ownerId: userId.toString(),
    priority: "high",
    projectStatus: "in_progress",
    dueDate: "2026-07-15",
    invitedUserIds: [invitedUserId],
  });

  const accessToken = createAccessToken(userId.toString());

  return {
    accessToken,
    invitedUser,
    invitedUserId,
    project,
    user,
    userId,
    workspaceId,
  };
};

const authCookie = (accessToken: string) => [`accessToken=${accessToken}`];

describe("GET /projects/summaries", () => {
  it("returns 401 when the user is not authenticated", async () => {
    const response = await request(app).get(`/projects/summaries`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Not authenticated" });
  });

  it("returns 400 if the query is invalid", async () => {
    const { accessToken } = await createAuthedProjectContext();

    const response = await request(app)
      .get("/projects/summaries")
      .query({ page: "0" })
      .set("Cookie", authCookie(accessToken));

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid querys" });
  });

  it("returns an empty paginated list when the workspace has no projects", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Empty Workspace",
      ownerId: userId,
    });

    await UserModel.create({
      _id: userId,
      email: "empty@example.com",
      name: "Empty User",
      passwordHash: "hashed-password",
      workspaceId,
      role: "admin",
      isEmailVerified: true,
    });

    const accessToken = createAccessToken(userId.toString());

    const response = await request(app)
      .get("/projects/summaries")
      .set("Cookie", authCookie(accessToken));

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        items: [],
        pagination: {
          totalPages: 0,
          currentPage: 1,
        },
      },
    });
  });

  it("returns project summaries with task, comment, attachment, and user stats", async () => {
    const { accessToken, invitedUserId, project, userId, workspaceId } =
      await createAuthedProjectContext();

    const [doneTask, pendingTask] = await TaskModel.create([
      {
        workspaceId,
        projectId: project._id,
        title: "Done Task",
        dueDate: "2026-07-10",
        taskStatus: "done",
        collaboratorIds: [userId],
        taskPriority: "high",
      },
      {
        workspaceId,
        projectId: project._id,
        title: "Pending Task",
        dueDate: "2026-07-11",
        taskStatus: "pending",
        collaboratorIds: [invitedUserId],
        taskPriority: "medium",
      },
    ]);

    await CommentModel.create([
      {
        workspaceId,
        taskId: doneTask._id,
        userId,
        message: "First comment",
      },
      {
        workspaceId,
        taskId: pendingTask._id,
        userId: invitedUserId,
        message: "Second comment",
      },
    ]);

    await AttachmentModel.create({
      workspaceId,
      projectId: project._id,
      userId,
      fileName: "brief.pdf",
      storageKey: "projects/brief.pdf",
      mimeType: "application/pdf",
      fileSize: 1024,
    });

    const response = await request(app)
      .get("/projects/summaries")
      .set("Cookie", authCookie(accessToken));

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.pagination).toEqual({
      totalPages: 1,
      currentPage: 1,
    });
    expect(response.body.data.items[0]).toMatchObject({
      id: project._id.toString(),
      title: "Test Project",
      priority: "high",
      projectStatus: "in_progress",
      dueDate: "2026-07-15",
      invitedUserIds: [invitedUserId.toString()],
      invitedUsers: [
        {
          id: invitedUserId.toString(),
          name: "Project Member",
        },
      ],
      progress: {
        total: 2,
        completed: 1,
        progressPercent: 50,
      },
      stats: {
        commentCount: 2,
        attachmentCount: 1,
        userCount: 1,
      },
    });
  });

  it("does not return summaries from another workspace", async () => {
    const { accessToken } = await createAuthedProjectContext();
    const otherWorkspaceId = new mongoose.Types.ObjectId();
    const otherOwnerId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: otherWorkspaceId,
      name: "Other Workspace",
      ownerId: otherOwnerId,
    });

    await ProjectModel.create({
      workspaceId: otherWorkspaceId,
      title: "Other Workspace Project",
      ownerId: otherOwnerId.toString(),
      priority: "low",
      projectStatus: "pending",
      dueDate: "2026-08-01",
    });

    const response = await request(app)
      .get("/projects/summaries")
      .query({ search: "Other Workspace Project" })
      .set("Cookie", authCookie(accessToken));

    expect(response.status).toBe(200);
    expect(response.body.data.items).toEqual([]);
  });

  it("filters summaries by search, priority, status, and attachment presence", async () => {
    const { accessToken, project, userId, workspaceId } =
      await createAuthedProjectContext();

    await ProjectModel.create([
      {
        workspaceId,
        title: "Backend Cleanup",
        ownerId: userId.toString(),
        priority: "medium",
        projectStatus: "pending",
        dueDate: "2026-08-01",
      },
      {
        workspaceId,
        title: "Website Launch",
        ownerId: userId.toString(),
        priority: "high",
        projectStatus: "done",
        dueDate: "2026-09-01",
      },
    ]);

    await AttachmentModel.create({
      workspaceId,
      projectId: project._id,
      userId,
      fileName: "roadmap.pdf",
      storageKey: "projects/roadmap.pdf",
      mimeType: "application/pdf",
      fileSize: 2048,
    });

    const response = await request(app)
      .get("/projects/summaries")
      .query({
        search: "test",
        priority: "high",
        status: "in_progress",
        hasAttachments: "true",
      })
      .set("Cookie", authCookie(accessToken));

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0]).toMatchObject({
      id: project._id.toString(),
      title: "Test Project",
      priority: "high",
      projectStatus: "in_progress",
      stats: {
        attachmentCount: 1,
      },
    });
  });

  it("paginates summaries with the requested page and limit", async () => {
    const { accessToken, project, userId, workspaceId } =
      await createAuthedProjectContext();

    await ProjectModel.create([
      {
        workspaceId,
        title: "Second Project",
        ownerId: userId.toString(),
        priority: "medium",
        projectStatus: "pending",
        dueDate: "2026-08-01",
      },
      {
        workspaceId,
        title: "Third Project",
        ownerId: userId.toString(),
        priority: "low",
        projectStatus: "done",
        dueDate: "2026-09-01",
      },
    ]);

    const response = await request(app)
      .get("/projects/summaries")
      .query({ page: "2", limit: "2" })
      .set("Cookie", authCookie(accessToken));

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0]).toMatchObject({
      id: project._id.toString(),
      title: "Test Project",
    });
    expect(response.body.data.pagination).toEqual({
      totalPages: 2,
      currentPage: 2,
    });
  });
});
