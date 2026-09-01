import { vi } from "vitest";

process.env.NODE_ENV = "test";
process.env.RESEND_API_KEY = "re_test_dummy";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.R2_PUBLIC_URL = "https://public-r2.test";
process.env.R2_PRIVATE_BUCKET_NAME = "test-private-bucket";

const redisMock = vi.hoisted(() => {
  const redisSubscriber = {
    connect: vi.fn(),
    on: vi.fn(),
    subscribe: vi.fn(),
  };

  return {
    redisClient: {
      connect: vi.fn(),
      duplicate: vi.fn(() => redisSubscriber),
      on: vi.fn(),
      publish: vi.fn(),
    },
    redisSubscriber,
  };
});

vi.mock("@/shared/config/redis", () => ({
  connectRedis: vi.fn(),
  connectRedisSubscriber: vi.fn(),
  redisClient: redisMock.redisClient,
  redisSubscriber: redisMock.redisSubscriber,
}));

vi.mock("@/queues/notificationQueue", () => ({
  notificationQueue: {
    add: vi.fn(),
    close: vi.fn(),
  },
}));

import "./setupSessionRepositoryMock";
import "./setupVerificationTokenRepositoryMock";
import "./setupRateLimitRepositoryMock";
