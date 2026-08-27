import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Server } from "socket.io";
import { redisSubscriber } from "@/shared/config/redis";
import { connectRealtimeSubscriber } from "@/socket/realtimeSubscriber";

vi.mock("@/shared/config/redis", () => ({
  redisSubscriber: {
    subscribe: vi.fn(),
  },
}));

describe("connectRealtimeSubscriber", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should emit a new notification event to each recipient user room", async () => {
    const emit = vi.fn();
    const to = vi.fn(() => ({ emit }));

    const io = {
      to,
    } as unknown as Server;

    vi.mocked(redisSubscriber.subscribe).mockImplementation(
      async (_channel, listener) => {
        await listener(
          JSON.stringify({
            userIds: ["user-1", "user-2"],
          }),
          "realtime-notifications",
        );
      },
    );

    await connectRealtimeSubscriber(io);

    expect(redisSubscriber.subscribe).toHaveBeenCalledWith(
      "realtime-notifications",
      expect.any(Function),
    );

    expect(to).toHaveBeenCalledWith("user:user-1");
    expect(to).toHaveBeenCalledWith("user:user-2");

    expect(emit).toHaveBeenCalledWith("notification:new");
    expect(emit).toHaveBeenCalledTimes(2);
  });
});
