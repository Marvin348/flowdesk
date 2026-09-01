import { beforeEach, describe, expect, it, vi } from "vitest";
import { publishRealtimeNotification } from "@/features/notification/handlers/publishRealtimeNotification";
import { redisClient } from "@/shared/config/redis";

vi.mock("@/shared/config/redis", () => ({
  redisClient: {
    publish: vi.fn(),
  },
}));

describe("publishRealtimeNotification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("publishes realtime notification user ids", async () => {
    const userIds = ["user-1", "user-2"];

    await publishRealtimeNotification(userIds);

    expect(redisClient.publish).toHaveBeenCalledWith(
      "realtime-notifications",
      JSON.stringify({
        userIds: ["user-1", "user-2"],
      }),
    );
  });
});
