import type { TestProject } from "vitest/node";
import { MongoMemoryReplSet } from "mongodb-memory-server";

declare module "vitest" {
  export interface ProvidedContext {
    mongoUri: string;
  }
}

export default async function globalSetup({ provide }: TestProject) {
  const mongoServer = await MongoMemoryReplSet.create({
    binary: {
      version: "7.0.14",
    },
    replSet: {
      count: 1,
      storageEngine: "wiredTiger",
    },
  });

  const mongoUri = mongoServer.getUri();

  provide("mongoUri", mongoUri);

  return async () => {
    await mongoServer.stop();
  };
}
