import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Server } from "socket.io";
import { redisSubscriber } from "@/shared/config/redis";
import { connectRealtimeSubscriber } from "@/socket/realtimeSubscriber";
import mongoose from "mongoose";

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
      async (channel, listener) => {
        if (channel !== "realtime-notifications") {
          return;
        }

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

  it("emits task events to the project room", async () => {
    const projectId = new mongoose.Types.ObjectId();

    const emit = vi.fn();
    const to = vi.fn(() => ({ emit }));

    const io = {
      to,
    } as unknown as Server;

    vi.mocked(redisSubscriber.subscribe).mockImplementation(
      async (channel, listener) => {
        if (channel !== "realtime-tasks") {
          return;
        }

        await listener(
          JSON.stringify({
            projectId: projectId,
            type: "task:status_changed",
          }),
          "realtime-tasks",
        );
      },
    );

    await connectRealtimeSubscriber(io);

    expect(redisSubscriber.subscribe).toHaveBeenCalledWith(
      "realtime-tasks",
      expect.any(Function),
    );

    expect(to).toHaveBeenCalledWith(`project:${projectId}`);

    expect(emit).toHaveBeenCalledWith("task:status_changed");
    expect(emit).toHaveBeenCalledTimes(1);
  });
});
