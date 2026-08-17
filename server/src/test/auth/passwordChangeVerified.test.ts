import {
  beforeAll,
  beforeEach,
  afterAll,
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import app from "@/app";
import { hashPassword } from "@/features/auth/utils/password";
import request from "supertest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import { createAuthedUserContext } from "@/test/helpers/testFactories";
import { UserModel } from "@/features/users/models/user.modal";
import { notificationQueue } from "@/queues/notificationQueue";
import { verificationTokenMock } from "@/test/setupVerificationTokenRepositoryMock";


beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterEach(() => {
  vi.restoreAllMocks();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("POST auth/password/change/verify", () => {
  it("returns 400 if the body is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .post("/auth/password/change/verify")
      .send("invalid-token")
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid token" });
  });

  it("returns 400 if the token does not exist", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .post("/auth/password/change/verify")
      .send({ token: "missing-password-change-token" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Token not found" });
  });

  it("returns if the new password is missing", async () => {
    const token = "valid-password-change-token";
    const { authCookie, userId } = await createAuthedUserContext();

    verificationTokenMock.seedVerificationToken({
      token,
      data: {
        userId: userId.toString(),
        type: "password_change",
      },
    });

    const response = await request(app)
      .post("/auth/password/change/verify")
      .send({ token })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "New password is missing",
    });
  });

  it("changes the password successfully", async () => {
    const token = "valid-password-change-token";
    const newPasswordHash = await hashPassword("NewPassword123!");
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();
    
    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockClear();
    queueAddMock.mockResolvedValue(undefined as never);

    verificationTokenMock.seedVerificationToken({
      token,
      data: {
        userId: userId.toString(),
        type: "password_change",
        newPasswordHash,
      },
    });

    const response = await request(app)
      .post("/auth/password/change/verify")
      .send({ token })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Password successfully changed",
    });

    const updatedUser =
      await UserModel.findById(userId).select("+passwordHash");

    expect(updatedUser).not.toBeNull();
    expect(updatedUser!.passwordHash).toBe(newPasswordHash);

    expect(queueAddMock).toHaveBeenCalledOnce();
    expect(queueAddMock).toHaveBeenCalledWith("user-password.changed", {
      workspaceId: workspaceId.toString(),
      recipientId: userId.toString(),
    });
  });

  it("allows only one concurrent request to verify a password change token", async () => {
    const token = "concurrent-password-change-token";
    const newPasswordHash = await hashPassword("NewPassword123!");
    const { authCookie, userId, workspaceId } = await createAuthedUserContext();

    verificationTokenMock.seedVerificationToken({
      token,
      data: {
        userId: userId.toString(),
        type: "password_change",
        newPasswordHash,
      },
    });

    const queueAddMock = vi.mocked(notificationQueue.add);
    queueAddMock.mockClear();
    queueAddMock.mockResolvedValue(undefined as never);

    const responses = await Promise.all([
      request(app)
        .post("/auth/password/change/verify")
        .send({ token })
        .set("Cookie", authCookie),
      request(app)
        .post("/auth/password/change/verify")
        .send({ token })
        .set("Cookie", authCookie),
    ]);

    const statuses = responses.map((response) => response.status).sort();

    expect(statuses).toEqual([200, 400]);
    expect(
      responses.find((response) => response.status === 400)?.body,
    ).toEqual({
      message: "Token not found",
    });

    const updatedUser =
      await UserModel.findById(userId).select("+passwordHash");

    expect(updatedUser).not.toBeNull();
    expect(updatedUser!.passwordHash).toBe(newPasswordHash);
    expect(updatedUser!.passwordChangedAt).toBeInstanceOf(Date);

    expect(queueAddMock).toHaveBeenCalledTimes(1);
    expect(queueAddMock).toHaveBeenCalledWith("user-password.changed", {
      workspaceId: workspaceId.toString(),
      recipientId: userId.toString(),
    });
  });
});
