import app from "@/app";
import { ActivityModel } from "@/features/activity/models/activity.model";
import { AttachmentModel } from "@/features/attachments/models/attachment.model";
import { ProjectModel } from "@/features/projects/models/project.model";
import { TaskModel } from "@/features/tasks/models/task.model";
import { UserModel } from "@/features/users/models/user.modal";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model";
import { uploadFileToR2 } from "@/lib/storage/r2Storage";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import mongoose from "mongoose";
import request from "supertest";
import { createAuthCookie } from "@/test/helpers/testFactories";

vi.mock("@/lib/storage/r2Storage.js", () => ({
  uploadFileToR2: vi.fn(),
  deleteFileFromR2: vi.fn(),
  createSignedDownloadUrl: vi.fn(),
}));

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
  vi.clearAllMocks();
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

  const authCookie = await createAuthCookie(userId);

  return {
    authCookie,
    project,
    user,
    userId,
    workspaceId,
  };
};

describe("POST /projects/:id/files", () => {
  it("returns 401 when the user is not authenticated", async () => {
    const projectId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .post(`/projects/${projectId}/files`)
      .attach("files", Buffer.from("fake-file-content"), "briefing.pdf");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Not authenticated" });
  });

  it("returns 400 when no files are uploaded", async () => {
    const { authCookie, project } = await createAuthedProjectContext();

    const response = await request(app)
      .post(`/projects/${project._id}/files`)
      .set("Cookie", authCookie)
      .field("taskId", "");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "No files uploaded" });
  });

  it("returns 404 when the project does not exist", async () => {
    vi.mocked(uploadFileToR2).mockResolvedValue("attachments/briefing.pdf");

    const { authCookie } = await createAuthedProjectContext();
    const missingProjectId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .post(`/projects/${missingProjectId}/files`)
      .set("Cookie", authCookie)
      .attach("files", Buffer.from("fake-file-content"), "briefing.pdf");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Project not found" });
    expect(uploadFileToR2).not.toHaveBeenCalled();
  });

  it("returns 404 when taskId does not exist in the project", async () => {
    vi.mocked(uploadFileToR2).mockResolvedValue("attachments/briefing.pdf");

    const { authCookie, project } = await createAuthedProjectContext();
    const missingTaskId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .post(`/projects/${project._id}/files`)
      .set("Cookie", authCookie)
      .field("taskId", missingTaskId.toString())
      .attach("files", Buffer.from("fake-file-content"), "briefing.pdf");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Task not found" });
    expect(uploadFileToR2).not.toHaveBeenCalled();
  });

  it("uploads files and creates attachments without taskId", async () => {
    vi.mocked(uploadFileToR2)
      .mockResolvedValueOnce("attachments/briefing.pdf")
      .mockResolvedValueOnce("attachments/design.png");

    const { authCookie, project, userId, workspaceId } =
      await createAuthedProjectContext();

    const response = await request(app)
      .post(`/projects/${project._id}/files`)
      .set("Cookie", authCookie)
      .attach("files", Buffer.from("pdf-content"), "briefing.pdf")
      .attach("files", Buffer.from("image-content"), "design.png");

    expect(response.status).toBe(201);
    expect(uploadFileToR2).toHaveBeenCalledTimes(2);
    expect(uploadFileToR2).toHaveBeenCalledWith(expect.any(Object), {
      prefix: "attachments",
      bucket: "private",
    });

    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0]).toMatchObject({
      workspaceId: workspaceId.toString(),
      projectId: project._id.toString(),
      taskId: null,
      userId: userId.toString(),
      fileName: "briefing.pdf",
      storageKey: "attachments/briefing.pdf",
      mimeType: "application/pdf",
    });
    expect(response.body.data[1]).toMatchObject({
      workspaceId: workspaceId.toString(),
      projectId: project._id.toString(),
      taskId: null,
      userId: userId.toString(),
      fileName: "design.png",
      storageKey: "attachments/design.png",
      mimeType: "image/png",
    });

    const attachments = await AttachmentModel.find({
      projectId: project._id,
      workspaceId,
    }).lean();

    expect(attachments).toHaveLength(2);
    expect(attachments.map((attachment) => attachment.fileName).sort()).toEqual(
      ["briefing.pdf", "design.png"],
    );
  });

  it("uploads files and stores taskId when taskId exists", async () => {
    vi.mocked(uploadFileToR2).mockResolvedValue("attachments/task-file.pdf");

    const { authCookie, project, userId, workspaceId } =
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

    const response = await request(app)
      .post(`/projects/${project._id}/files`)
      .set("Cookie", authCookie)
      .field("taskId", task._id.toString())
      .attach("files", Buffer.from("fake-file-content"), "task-file.pdf");

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toMatchObject({
      projectId: project._id.toString(),
      taskId: task._id.toString(),
      userId: userId.toString(),
      fileName: "task-file.pdf",
      storageKey: "attachments/task-file.pdf",
      mimeType: "application/pdf",
    });

    const attachment = await AttachmentModel.findOne({
      projectId: project._id,
      taskId: task._id,
      workspaceId,
    }).lean();

    expect(attachment).toMatchObject({
      fileName: "task-file.pdf",
      storageKey: "attachments/task-file.pdf",
    });
  });

  it("creates an activity entry for every uploaded attachment", async () => {
    vi.mocked(uploadFileToR2)
      .mockResolvedValueOnce("attachments/briefing.pdf")
      .mockResolvedValueOnce("attachments/design.png");

    const { authCookie, project, userId, workspaceId } =
      await createAuthedProjectContext();

    const response = await request(app)
      .post(`/projects/${project._id}/files`)
      .set("Cookie", authCookie)
      .attach("files", Buffer.from("pdf-content"), "briefing.pdf")
      .attach("files", Buffer.from("image-content"), "design.png");

    expect(response.status).toBe(201);

    const activities = await ActivityModel.find({
      workspaceId,
      actorId: userId,
      type: "attachment.uploaded",
      entityType: "attachment",
    }).lean();

    expect(activities).toHaveLength(2);
    expect(
      activities.map((activity) => activity.metadata?.fileName).sort(),
    ).toEqual(["briefing.pdf", "design.png"]);
    expect(activities[0]?.metadata).toMatchObject({
      projectId: project._id.toString(),
      taskId: null,
    });
  });
});
