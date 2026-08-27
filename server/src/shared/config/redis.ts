import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is not defined");
}

export const redisClient = createClient({
  url: redisUrl,
});

export const redisSubscriber = redisClient.duplicate();

redisClient.on("error", (error) => {
  console.error("Redis client error:", error);
});

redisSubscriber.on("error", (error) => {
  console.error("Redis subscriber error:", error);
});

export const connectRedis = async () => {
  await redisClient.connect();
  console.log("Redis connected");
};

export const connectRedisSubscriber = async () => {
  await redisSubscriber.connect();
  console.log("Redis subscriber connected");
};
