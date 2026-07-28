import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";

let mongoServer: MongoMemoryReplSet;

export const connectTestDb = async () => {
  mongoServer = await MongoMemoryReplSet.create({
    binary: {
      version: "7.0.14",
    },
    replSet: {
      count: 1,
      storageEngine: "wiredTiger",
    },
  });
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
};

export const clearTestDb = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

export const disconnectTestDb = async () => {
  await mongoose.disconnect();
  await mongoServer?.stop();
};
