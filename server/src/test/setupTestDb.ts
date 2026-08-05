import mongoose from "mongoose";
import { inject } from "vitest";

export const connectTestDb = async () => {
  const mongoUri = inject("mongoUri");

  if (!mongoUri) {
    throw new Error(
      "mongoUri was not provided. Check whether Vitest globalSetup is configured correctly.",
    );
  }

  const workerId = process.env.VITEST_POOL_ID ?? "0";
  const dbName = `flowdesk_test_${workerId}`;

  await mongoose.connect(mongoUri, {
    dbName,
  });
};

export const clearTestDb = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

export const disconnectTestDb = async () => {
  await mongoose.disconnect();
};
