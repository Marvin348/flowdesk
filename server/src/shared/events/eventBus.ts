type EventHandler<T> = (payload: T) => Promise<void>;

class EventBus {
  private handlers = new Map<string, EventHandler<any>[]>();

  on<T>(eventName: string, handler: EventHandler<T>) {
    const existingHandlers = this.handlers.get(eventName) ?? [];

    this.handlers.set(eventName, [...existingHandlers, handler]);
  }

  async emit<T>(eventName: string, payload: T) {
    const handlers = this.handlers.get(eventName) ?? [];

    await Promise.all(
      handlers.map((handler) => handler(payload)),
    );
  }
}

export const eventBus = new EventBus();