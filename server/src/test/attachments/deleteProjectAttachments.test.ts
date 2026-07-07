import app from "@/app.js";
import { ActivityModel } from "@/features/activity/models/activity.model.js";
import { AttachmentModel } from "@/features/attachments/models/attachment.model.js";
import { createAccessToken } from "@/features/auth/utils/tokens.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model.js";
import { deleteFileFromR2 } from "@/lib/storage/r2Storage.js";
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
} from "@/test/setupTestDb.js";
import mongoose from "mongoose";
import request from "supertest";

vi.mock("@/lib/storage/r2Storage.js", () => ({
  deleteFileFromR2: vi.fn(),
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
  const memberUserId = new mongoose.Types.ObjectId();
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

  const memberUser = await UserModel.create({
    _id: memberUserId,
    email: "test@example.com",
    name: "Test User",
    passwordHash: "hashed-password",
    workspaceId,
    role: "member",
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

  const attachment = await AttachmentModel.create({
    workspaceId,
    projectId: project._id,
    taskId: null,
    userId,
    fileName: "briefing.pdf",
    storageKey: "attachments/briefing.pdf",
    mimeType: "application/pdf",
    fileSize: 1024,
  });

  const accessToken = createAccessToken(userId.toString());
  const accessTokenMember = createAccessToken(memberUserId.toString());

  return {
    accessToken,
    accessTokenMember,
    project,
    user,
    attachment,
    userId,
    workspaceId,
  };
};

describe("DELETE /projects/:id/files/:fileId", () => {
  it("returns 404 if attachment does not exist", async () => {
    const { accessToken, project } = await createAuthedProjectContext();

    const fakeAttachmentId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/projects/${project._id}/files/${fakeAttachmentId}`)
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(404);
  });

  it("returns 403 if the user is not a admin", async () => {
    const { accessTokenMember, project, attachment } =
      await createAuthedProjectContext();

    const response = await request(app)
      .delete(`/projects/${project._id}/files/${attachment._id}`)
      .set("Cookie", [`accessToken=${accessTokenMember}`]);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: "Only admins can delete attachments" });
  });

  it("deletes an attachment and removes the file from R2", async () => {
    vi.mocked(deleteFileFromR2).mockResolvedValue(undefined);

    const { accessToken, project, attachment } = await createAuthedProjectContext();

    const response = await request(app)
      .delete(`/projects/${project._id}/files/${attachment._id}`)
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      acknowledged: true,
      deletedCount: 1,
    });

    expect(deleteFileFromR2).toHaveBeenCalledWith({
      storageKey: "attachments/briefing.pdf",
      bucket: "private",
    });

    const deletedAttachment = await AttachmentModel.findById(attachment._id);

    expect(deletedAttachment).toBeNull();
  });

  it("creates an activity entry when an attachment is deleted", async () => {
    vi.mocked(deleteFileFromR2).mockResolvedValue(undefined);

    const { accessToken, project, attachment, userId, workspaceId } =
      await createAuthedProjectContext();

    const response = await request(app)
      .delete(`/projects/${project._id}/files/${attachment._id}`)
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(200);

    const activity = await ActivityModel.findOne({
      workspaceId,
      actorId: userId,
      type: "attachment.deleted",
      entityType: "attachment",
      entityId: attachment._id,
    }).lean();

    expect(activity).toMatchObject({
      metadata: {
        fileName: "briefing.pdf",
      },
    });
  });

  it("returns 404 if the project does not exist", async () => {
    const { accessToken, attachment } = await createAuthedProjectContext();
    const missingProjectId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/projects/${missingProjectId}/files/${attachment._id}`)
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Project not found" });
    expect(deleteFileFromR2).not.toHaveBeenCalled();
  });
});
