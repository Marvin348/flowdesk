import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const mongoUri = process.env.MONGODB_URL;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not in .env file");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection lost", error);
    process.exit(1);
  }
};