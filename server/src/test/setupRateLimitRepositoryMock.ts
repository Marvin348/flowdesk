import { vi } from "vitest";

const setupRateLimitRepositoryMock = vi.hoisted(() => ({
  consumeRateLimitCounter: vi.fn(async () => 1),
  getRateLimitTtl: vi.fn(async () => 60),
}));

vi.mock("@/features/rate-limits/repository/rateLimit.repository", () => ({
  consumeRateLimitCounter: setupRateLimitRepositoryMock.consumeRateLimitCounter,
  getRateLimitTtl: setupRateLimitRepositoryMock.getRateLimitTtl,
}));

export const rateLimitRepositoryMock = setupRateLimitRepositoryMock;
