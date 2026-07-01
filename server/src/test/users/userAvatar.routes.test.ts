import app from "@/app.js";
import request from "supertest";
import {
  beforeAll,
  beforeEach,
  afterAll,
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
import { UserModel } from "@/features/users/models/user.modal.js";
import mongoose from "mongoose";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model.js";
import { createAccessToken } from "@/features/auth/utils/tokens.js";
import { uploadFileToR2, deleteFileFromR2 } from "@/lib/storage/r2Storage.js";

vi.mock("@/lib/storage/r2Storage.js", () => ({
  uploadFileToR2: vi.fn(),
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

describe("PATCH /users/me/avatar", () => {
  it("returns 401 when user is not authenticated", async () => {
    const response = await request(app)
      .patch("/users/me/avatar")
      .send({ email: "member@example.com" });

    expect(response.status).toBe(401);
  });

  it("returns 400 when no avatar file is uploaded", async () => {
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
      .patch("/users/me/avatar")
      .set("Cookie", [`accessToken=${accessToken}`])
      .field("unused", "value");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "No file uploaded" });
  });

  it("uploads an avatar and stores the avatar storage key", async () => {
    vi.mocked(uploadFileToR2).mockResolvedValue("avatars/test-avatar.png");
    vi.mocked(deleteFileFromR2).mockResolvedValue(undefined);

    const user = await UserModel.create({
      email: "marvin@example.com",
      name: "Marvin",
      workspaceId: new mongoose.Types.ObjectId(),
      passwordHash: "hashed-password",
      role: "admin",
      isEmailVerified: true,
    });

    const accessToken = createAccessToken(user._id.toString());

    const response = await request(app)
      .patch("/users/me/avatar")
      .set("Cookie", [`accessToken=${accessToken}`])
      .attach("avatar", Buffer.from("fake-image-content"), "avatar.png");

    expect(response.status).toBe(200);

    expect(uploadFileToR2).toHaveBeenCalled();

    const updatedUser = await UserModel.findById(user._id).lean();

    if (!updatedUser) {
      throw new Error("Expected updated user to exist");
    }

    expect(updatedUser.avatarStorageKey).toBe("avatars/test-avatar.png");
    expect(deleteFileFromR2).not.toHaveBeenCalled();

    expect(response.body.uploadedAvatar.avatarUrl).toBe(
      "https://public-r2.test/avatars/test-avatar.png",
    );
  });

  it("replaces existing avatar and deletes old R2 object", async () => {
    vi.mocked(uploadFileToR2).mockResolvedValue("avatars/test-avatar.png");
    vi.mocked(deleteFileFromR2).mockResolvedValue(undefined);

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
      avatarStorageKey: "avatars/old-avatar.png",
      role: "admin",
      isEmailVerified: true,
    });

    const accessToken = createAccessToken(userId.toString());

    const response = await request(app)
      .patch("/users/me/avatar")
      .set("Cookie", [`accessToken=${accessToken}`])
      .attach("avatar", Buffer.from("fake-image-content"), "avatar.png");

    expect(response.status).toBe(200);
    expect(deleteFileFromR2).toHaveBeenCalledWith({
      storageKey: "avatars/old-avatar.png",
      bucket: "public",
    });

    const updatedUser = await UserModel.findById(userId);

    if (!updatedUser) {
      throw new Error("Expected updated user to exist");
    }

    expect(updatedUser.avatarStorageKey).toBe("avatars/test-avatar.png");
  });
});
