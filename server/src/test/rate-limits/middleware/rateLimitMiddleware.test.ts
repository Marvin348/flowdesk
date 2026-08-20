import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { rateLimitMiddleware } from "@/features/rate-limits/middleware/rateLimitMiddleware";
import { consumeRateLimit } from "@/features/rate-limits/services/rateLimit.service";
import type { RateLimitTypes } from "@/features/rate-limits/types/rateLimits";
import { errorHandler } from "@/middleware/errorHandler";

vi.mock("@/features/rate-limits/services/rateLimit.service", () => ({
  consumeRateLimit: vi.fn(),
}));

const createTestApp = (type: RateLimitTypes, userId?: string) => {
  const app = express();

  app.set("trust proxy", 1);
  app.use(express.json());

  if (userId) {
    app.use((req, _res, next) => {
      req.user = {
        id: userId,
        workspaceId: "test-workspace-id" as never,
        role: "admin",
      };
      next();
    });
  }

  app.post("/test", rateLimitMiddleware(type), (_req, res) => {
    res.status(200).json({ ok: true });
  });
  app.use(errorHandler);

  return app;
};

describe("rateLimitMiddleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("passes the ip rate limit rule to the service", async () => {
    vi.mocked(consumeRateLimit).mockResolvedValue({
      allowed: true,
      retryAfterSeconds: undefined,
    });

    const response = await request(createTestApp("login"))
      .post("/test")
      .set("X-Forwarded-For", "203.0.113.10")
      .send({});

    expect(response.status).toBe(200);
    expect(consumeRateLimit).toHaveBeenCalledWith({
      type: "login",
      identifierType: "ip",
      identifier: "203.0.113.10",
      maxRequests: 100,
      ttlSeconds: 120,
    });
  });

  it("passes the email rate limit rule to the service", async () => {
    vi.mocked(consumeRateLimit).mockResolvedValue({
      allowed: true,
      retryAfterSeconds: undefined,
    });

    const response = await request(createTestApp("login"))
      .post("/test")
      .send({ email: "  TestEmail@Test.de  " });

    expect(response.status).toBe(200);
    expect(consumeRateLimit).toHaveBeenCalledTimes(2);
    expect(consumeRateLimit).toHaveBeenCalledWith({
      type: "login",
      identifierType: "email",
      identifier: "testemail@test.de",
      maxRequests: 10,
      ttlSeconds: 900,
    });
  });

  it("skips the email rule when the request has no email identifier", async () => {
    vi.mocked(consumeRateLimit).mockResolvedValue({
      allowed: true,
      retryAfterSeconds: undefined,
    });

    const response = await request(createTestApp("login"))
      .post("/test")
      .send({});

    expect(response.status).toBe(200);
    expect(consumeRateLimit).toHaveBeenCalledTimes(1);
    expect(consumeRateLimit).toHaveBeenCalledWith({
      type: "login",
      identifierType: "ip",
      identifier: "::ffff:127.0.0.1",
      maxRequests: 100,
      ttlSeconds: 120,
    });
  });

  it("returns 429 and sets Retry-After when a rule is blocked", async () => {
    vi.mocked(consumeRateLimit).mockResolvedValueOnce({
      allowed: false,
      retryAfterSeconds: 42,
    });

    const response = await request(createTestApp("login"))
      .post("/test")
      .send({});

    expect(response.status).toBe(429);
    expect(response.headers["retry-after"]).toBe("42");
    expect(response.body).toEqual({
      message: "You have sent too many requests in a short period of time",
    });
    expect(consumeRateLimit).toHaveBeenCalledTimes(1);
  });

  it("passes the authenticated user id for user based rate limits", async () => {
    vi.mocked(consumeRateLimit).mockResolvedValue({
      allowed: true,
      retryAfterSeconds: undefined,
    });

    const response = await request(createTestApp("change_password", "user-123"))
      .post("/test")
      .send({});

    expect(response.status).toBe(200);
    expect(consumeRateLimit).toHaveBeenCalledTimes(1);
    expect(consumeRateLimit).toHaveBeenCalledWith({
      type: "change_password",
      identifierType: "user",
      identifier: "user-123",
      maxRequests: 5,
      ttlSeconds: 900,
    });
  });
});
