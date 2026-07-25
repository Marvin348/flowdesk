import { describe, expect, it, vi } from "vitest";
import { eventBus } from "@/shared/events/eventBus";

describe("eventBus", () => {
  it("calls the registered handler when an event is emitted", async () => {
    const handler = vi.fn();

    eventBus.on<{ message: string }>("test.event", handler);

    await eventBus.emit("test.event", {
      message: "EventBus funktioniert",
    });

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith({
      message: "EventBus funktioniert",
    });
  });
});