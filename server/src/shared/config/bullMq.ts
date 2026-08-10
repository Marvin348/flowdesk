const redisUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REDIS_URL
    : process.env.BULLMQ_REDIS_URL;

if (!redisUrl) {
  throw new Error("BULLMQ_REDIS_URL is not defined");
}

export const bullMqConnection = {
  url: redisUrl,
};
