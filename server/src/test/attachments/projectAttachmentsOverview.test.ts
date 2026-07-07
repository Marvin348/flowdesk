import app from "@/app.js";
import { AttachmentModel } from "@/features/attachments/models/attachment.model.js";
import { createAccessToken } from "@/features/auth/utils/tokens.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model.js";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
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

  const project = await ProjectModel.create({
    workspaceId,
    title: "Test Project",
    ownerId: userId.toString(),
    priority: "high",
    projectStatus: "in_progress",
    dueDate: "2026-07-15",
  });

  const accessToken = createAccessToken(userId.toString());

  return {
    accessToken,
    project,
    user,
    userId,
    workspaceId,
  };
};

const createAttachment = ({
  workspaceId,
  projectId,
  userId,
  taskId = null,
  fileName = "briefing.pdf",
  mimeType = "application/pdf",
}: {
  workspaceId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  taskId?: mongoose.Types.ObjectId | null;
  fileName?: string;
  mimeType?: string;
}) =>
  AttachmentModel.create({
    workspaceId,
    projectId,
    taskId,
    userId,
    fileName,
    storageKey: `attachments/${fileName}`,
    mimeType,
    fileSize: 1024,
  });

describe("GET /projects/:projectId/files", () => {
  it("returns 401 when the user is not authenticated", async () => {
    const projectId = new mongoose.Types.ObjectId();

    const response = await request(app).get(`/projects/${projectId}/files`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Not authenticated" });
  });

  it("returns 404 when the project does not exist", async () => {
    const { accessToken } = await createAuthedProjectContext();
    const missingProjectId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/projects/${missingProjectId}/files`)
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Project not found" });
  });

  it("returns attachments with uploadedBy", async () => {
    const { accessToken, project, user, userId, workspaceId } =
      await createAuthedProjectContext();

    const attachment = await createAttachment({
      workspaceId,
      projectId: project._id,
      userId,
      fileName: "briefing.pdf",
      mimeType: "application/pdf",
    });

    const response = await request(app)
      .get(`/projects/${project._id}/files`)
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0]).toMatchObject({
      id: attachment._id.toString(),
      projectId: project._id.toString(),
      taskId: null,
      userId: userId.toString(),
      fileName: "briefing.pdf",
      mimeType: "application/pdf",
      fileSize: 1024,
      task: null,
      uploadedBy: {
        id: user._id.toString(),
        name: "Test User",
        email: "test@example.com",
      },
    });
  });

  it("returns task when taskId exists", async () => {
    const { accessToken, project, userId, workspaceId } =
      await createAuthedProjectContext();

    const task = await TaskModel.create({
      workspaceId,
      projectId: project._id,
      title: "Prepare launch",
      dueDate: "2026-07-10",
      taskStatus: "pending",
      collaboratorIds: [userId],
      taskPriority: "high",
    });

    await createAttachment({
      workspaceId,
      projectId: project._id,
      userId,
      taskId: task._id,
      fileName: "launch-plan.pdf",
    });

    const response = await request(app)
      .get(`/projects/${project._id}/files`)
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0]).toMatchObject({
      taskId: task._id.toString(),
      task: {
        id: task._id.toString(),
        title: "Prepare launch",
      },
    });
  });

  it("returns task null when no taskId exists", async () => {
    const { accessToken, project, userId, workspaceId } =
      await createAuthedProjectContext();

    await createAttachment({
      workspaceId,
      projectId: project._id,
      userId,
      taskId: null,
      fileName: "general-note.pdf",
    });

    const response = await request(app)
      .get(`/projects/${project._id}/files`)
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0]).toMatchObject({
      taskId: null,
      task: null,
    });
  });

  it("filters search by fileName and mimeType", async () => {
    const { accessToken, project, userId, workspaceId } =
      await createAuthedProjectContext();

    await AttachmentModel.create([
      {
        workspaceId,
        projectId: project._id,
        taskId: null,
        userId,
        fileName: "invoice.pdf",
        storageKey: "attachments/invoice.pdf",
        mimeType: "application/pdf",
        fileSize: 1024,
      },
      {
        workspaceId,
        projectId: project._id,
        taskId: null,
        userId,
        fileName: "team-photo.png",
        storageKey: "attachments/team-photo.png",
        mimeType: "image/png",
        fileSize: 2048,
      },
      {
        workspaceId,
        projectId: project._id,
        taskId: null,
        userId,
        fileName: "notes.txt",
        storageKey: "attachments/notes.txt",
        mimeType: "text/plain",
        fileSize: 512,
      },
    ]);

    const fileNameResponse = await request(app)
      .get(`/projects/${project._id}/files`)
      .query({ search: "invoice" })
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(fileNameResponse.status).toBe(200);
    expect(fileNameResponse.body.data.items).toHaveLength(1);
    expect(fileNameResponse.body.data.items[0]).toMatchObject({
      fileName: "invoice.pdf",
    });

    const mimeTypeResponse = await request(app)
      .get(`/projects/${project._id}/files`)
      .query({ search: "image" })
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(mimeTypeResponse.status).toBe(200);
    expect(mimeTypeResponse.body.data.items).toHaveLength(1);
    expect(mimeTypeResponse.body.data.items[0]).toMatchObject({
      fileName: "team-photo.png",
      mimeType: "image/png",
    });
  });

  it("returns totalPages and currentPage for pagination", async () => {
    const { accessToken, project, userId, workspaceId } =
      await createAuthedProjectContext();

    await AttachmentModel.create(
      Array.from({ length: 5 }, (_, index) => ({
        workspaceId,
        projectId: project._id,
        taskId: null,
        userId,
        fileName: `attachment-${index + 1}.pdf`,
        storageKey: `attachments/attachment-${index + 1}.pdf`,
        mimeType: "application/pdf",
        fileSize: 1024,
      })),
    );

    const response = await request(app)
      .get(`/projects/${project._id}/files`)
      .query({ page: 2, limit: 2 })
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(2);
    expect(response.body.data.pagination).toEqual({
      totalPages: 3,
      currentPage: 2,
    });
  });
});
