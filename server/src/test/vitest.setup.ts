import { vi } from "vitest";

process.env.NODE_ENV = "test";
process.env.RESEND_API_KEY = "re_test_dummy";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.R2_PUBLIC_URL = "https://public-r2.test";
process.env.R2_PRIVATE_BUCKET_NAME = "test-private-bucket";

vi.mock("@/queues/notificationQueue", () => ({
  notificationQueue: {
    add: vi.fn(),
    close: vi.fn(),
  },
}));

import "./setupSessionRepositoryMock";

