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
import { createAccessToken } from "@/features/auth/utils/tokens.js";
import { deleteFileFromR2 } from "@/lib/storage/r2Storage.js";

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

describe("DELETE /users/me/avatar", () => {
  it("deletes the avatar from R2 and removes its storage key from the user", async () => {
    vi.mocked(deleteFileFromR2).mockResolvedValue(undefined);

    const user = await UserModel.create({
      email: "test@example.com",
      name: "test",
      workspaceId: new mongoose.Types.ObjectId(),
      passwordHash: "hashed-password",
      avatarStorageKey: "avatars/test-avatar.png",
      role: "admin",
      isEmailVerified: true,
    });

    const accessToken = createAccessToken(user._id.toString());

    const response = await request(app)
      .delete("/users/me/avatar")
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Avatar deleted successfully" });
    expect(deleteFileFromR2).toHaveBeenCalledWith({
      storageKey: "avatars/test-avatar.png",
      bucket: "public",
    });

    const updatedUser = await UserModel.findById(user._id).lean();

    expect(updatedUser?.avatarStorageKey).toBeUndefined();
  });

  it("returns success without deleting from R2 when the user has no avatar", async () => {
    const user = await UserModel.create({
      email: "test@example.com",
      name: "test",
      workspaceId: new mongoose.Types.ObjectId(),
      passwordHash: "hashed-password",
      role: "admin",
      isEmailVerified: true,
    });

    const accessToken = createAccessToken(user._id.toString());

    const response = await request(app)
      .delete("/users/me/avatar")
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Avatar deleted successfully" });
    expect(deleteFileFromR2).not.toHaveBeenCalled();
  });
});
