import { redisClient } from "@/shared/config/redis";

export const publishRealtimeNotification = async (userIds: string[]) => {
  await redisClient.publish(
    "realtime-notifications",
    JSON.stringify({ userIds }),
  );
};
