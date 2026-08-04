import app from "@/app";
import { deleteSession } from "@/features/sessions/repository/session.repository";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/sessions/repository/session.repository", () => ({
  saveSession: vi.fn(),
  findSession: vi.fn(),
  deleteSession: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /auth/logout", () => {
  it("deletes the current session and clears the session cookie", async () => {
    const response = await request(app)
      .post("/auth/logout")
      .set("Cookie", ["sessionId=test-session-id"]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Logout successful" });
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.headers["set-cookie"][0]).toContain("sessionId=");
    expect(response.headers["set-cookie"][0]).toContain("Expires=Thu, 01 Jan 1970");
    expect(deleteSession).toHaveBeenCalledWith("test-session-id");
  });

  it("clears the session cookie even when no session cookie is present", async () => {
    const response = await request(app).post("/auth/logout");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Logout successful" });
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.headers["set-cookie"][0]).toContain("sessionId=");
    expect(deleteSession).not.toHaveBeenCalled();
  });
});
