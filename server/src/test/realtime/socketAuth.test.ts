import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Socket } from "socket.io";
import { findSession } from "@/features/sessions/repository/session.repository";
import { socketAuth } from "@/socket/socketAuth";
import mongoose from "mongoose";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import { createUser } from "@/test/helpers/testFactories";

const buildSocket = (cookie?: string) =>
  ({
    request: {
      headers: {
        cookie,
      },
    },
    data: {},
  }) as unknown as Socket;

const expectUnauthorized = (next: ReturnType<typeof vi.fn>) => {
  expect(next).toHaveBeenCalledWith(expect.any(Error));
  expect(next.mock.calls[0][0].message).toBe("Unauthorized");
};

describe("socketAuth", () => {
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

  it("rejects when no cookie header is present", async () => {
    const socket = buildSocket();
    const next = vi.fn();

    await socketAuth(socket, next);

    expectUnauthorized(next);
    expect(findSession).not.toHaveBeenCalled();
  });

  it("rejects when the cookie header does not contain a session id", async () => {
    const socket = buildSocket("theme=dark");
    const next = vi.fn();

    await socketAuth(socket, next);

    expectUnauthorized(next);
    expect(findSession).not.toHaveBeenCalled();
  });

  it("rejects when the session does not exist", async () => {
    vi.mocked(findSession).mockResolvedValue(null);

    const socket = buildSocket("sessionId=missing-session");
    const next = vi.fn();

    await socketAuth(socket, next);

    expectUnauthorized(next);
    expect(findSession).toHaveBeenCalledWith("missing-session");
  });

  it("attaches the session user id and workspace id to the socket", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();

    await createUser({
      _id: userId,
      workspaceId,
    });

    vi.mocked(findSession).mockResolvedValue({
      userId: userId.toString(),
      createdAt: new Date().toISOString(),
      absoluteExpiresAt: new Date(Date.now() + 60_000).toISOString(),
    });

    const socket = buildSocket("sessionId=valid-session");
    const next = vi.fn();

    await socketAuth(socket, next);

    expect(socket.data.userId).toBe(userId.toString());
    expect(socket.data.workspaceId).toBe(workspaceId.toString());
    expect(findSession).toHaveBeenCalledWith("valid-session");
    expect(next).toHaveBeenCalledWith();
  });

  it("rejects when the session user does not exist", async () => {
    const userId = new mongoose.Types.ObjectId();

    vi.mocked(findSession).mockResolvedValue({
      userId: userId.toString(),
      createdAt: new Date().toISOString(),
      absoluteExpiresAt: new Date(Date.now() + 60_000).toISOString(),
    });

    const socket = buildSocket("sessionId=valid-session");
    const next = vi.fn();

    await socketAuth(socket, next);

    expectUnauthorized(next);
    expect(socket.data.userId).toBeUndefined();
    expect(socket.data.workspaceId).toBeUndefined();
  });

  it("rejects when session lookup fails", async () => {
    vi.mocked(findSession).mockRejectedValue(new Error("Redis unavailable"));

    const socket = buildSocket("sessionId=valid-session");
    const next = vi.fn();

    await socketAuth(socket, next);

    expectUnauthorized(next);
  });
});
