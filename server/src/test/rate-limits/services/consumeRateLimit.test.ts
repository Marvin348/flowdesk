import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/test/setupRateLimitRepositoryMock";
import { consumeRateLimit } from "@/features/rate-limits/services/rateLimit.service";
import { rateLimitRepositoryMock } from "@/test/setupRateLimitRepositoryMock";

describe("consumeRateLimit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows the request when the counter is within the configured limit", async () => {
    rateLimitRepositoryMock.consumeRateLimitCounter.mockResolvedValue(1);

    const result = await consumeRateLimit({
      type: "login",
      identifierType: "email",
      identifier: "test@example.com",
      maxRequests: 3,
      ttlSeconds: 60,
    });

    expect(result).toEqual({
      allowed: true,
      retryAfterSeconds: undefined,
    });

    expect(
      rateLimitRepositoryMock.consumeRateLimitCounter,
    ).toHaveBeenCalledWith({
      type: "login",
      identifierType: "email",
      identifier: "test@example.com",
      ttlSeconds: 60,
    });
    expect(rateLimitRepositoryMock.getRateLimitTtl).not.toHaveBeenCalled();
  });

  it("forbids the req when the counter is over the configured limit", async () => {
    rateLimitRepositoryMock.consumeRateLimitCounter.mockResolvedValue(11);
    rateLimitRepositoryMock.getRateLimitTtl.mockResolvedValue(900);

    const result = await consumeRateLimit({
      type: "login",
      identifierType: "email",
      identifier: "test@example.com",
      maxRequests: 10,
      ttlSeconds: 900,
    });

    expect(result).toEqual({
      allowed: false,
      retryAfterSeconds: 900,
    });

    expect(
      rateLimitRepositoryMock.consumeRateLimitCounter,
    ).toHaveBeenCalledWith({
      type: "login",
      identifierType: "email",
      identifier: "test@example.com",
      ttlSeconds: 900,
    });

    expect(rateLimitRepositoryMock.getRateLimitTtl).toHaveBeenCalledWith({
      type: "login",
      identifierType: "email",
      identifier: "test@example.com",
    });
  });

  it("allows the request when the counter is the limit", async () => {
    rateLimitRepositoryMock.consumeRateLimitCounter.mockResolvedValue(10);

    const result = await consumeRateLimit({
      type: "login",
      identifierType: "email",
      identifier: "test@example.com",
      maxRequests: 10,
      ttlSeconds: 900,
    });

    expect(result.allowed).toBe(true);
    expect(result.retryAfterSeconds).toBeUndefined();
    expect(rateLimitRepositoryMock.getRateLimitTtl).not.toHaveBeenCalled();
  });
});
