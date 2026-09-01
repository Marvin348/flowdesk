import { redisSubscriber } from "@/shared/config/redis";
import type { Server } from "socket.io";

export const connectRealtimeSubscriber = async (io: Server) => {
  await redisSubscriber.subscribe("realtime-notifications", (message) => {
    const data = JSON.parse(message);

    for (const userId of data.userIds) {
      io.to(`user:${userId}`).emit("notification:new");
    }
  });

  await redisSubscriber.subscribe("realtime-tasks", (message) => {
    const data = JSON.parse(message);

    io.to(`project:${data.projectId}`).emit(data.type);
  });
};
