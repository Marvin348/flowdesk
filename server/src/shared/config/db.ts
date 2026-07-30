import mongoose from "mongoose";

export const connectDb = async () => {
  const mongoUri = process.env.MONGODB_URL;

  if (!mongoUri) {
    throw new Error("MONGODB_URL is not in .env file");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};