import app from "@/app";
import { AttachmentModel } from "@/features/attachments/models/attachment.model";
import { createAccessToken } from "@/features/auth/utils/tokens";
import { ProjectModel } from "@/features/projects/models/project.model";
import { UserModel } from "@/features/users/models/user.modal";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model";
import { createSignedDownloadUrl } from "@/lib/storage/r2Storage";
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

vi.mock("@/lib/storage/r2Storage.js", () => ({
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

  return {
    accessToken,
    project,
    user,
    attachment,
    userId,
    workspaceId,
  };
};

describe("GET /attachments/:attachmentId/download", () => {
  it("redirects to a signed download url", async () => {
    const { accessToken, attachment } = await createAuthedProjectContext();

    vi.mocked(createSignedDownloadUrl).mockResolvedValue(
      "https://signed-download-url.test/file.pdf",
    );

    const response = await request(app)
      .get(`/attachments/${attachment._id}/download`)
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe(
      "https://signed-download-url.test/file.pdf",
    );

    expect(createSignedDownloadUrl).toHaveBeenCalledWith(attachment.storageKey);
  });

  it("returns 404 if attachment does not exist", async () => {
    const { accessToken } = await createAuthedProjectContext();

    const fakeAttachmentId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/attachments/${fakeAttachmentId}/download`)
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Attachment not found" });
  });
});
