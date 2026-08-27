import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Socket } from "socket.io";
import { findSession } from "@/features/sessions/repository/session.repository";
import { socketAuth } from "@/socket/socketAuth";

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
  beforeEach(() => {
    vi.clearAllMocks();
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

  it("attaches the session user id to the socket", async () => {
    vi.mocked(findSession).mockResolvedValue({
      userId: "user-1",
      createdAt: new Date().toISOString(),
      absoluteExpiresAt: new Date(Date.now() + 60_000).toISOString(),
    });

    const socket = buildSocket("sessionId=valid-session");
    const next = vi.fn();

    await socketAuth(socket, next);

    expect(socket.data.userId).toBe("user-1");
    expect(findSession).toHaveBeenCalledWith("valid-session");
    expect(next).toHaveBeenCalledWith();
  });

  it("rejects when session lookup fails", async () => {
    vi.mocked(findSession).mockRejectedValue(new Error("Redis unavailable"));

    const socket = buildSocket("sessionId=valid-session");
    const next = vi.fn();

    await socketAuth(socket, next);

    expectUnauthorized(next);
  });
});
