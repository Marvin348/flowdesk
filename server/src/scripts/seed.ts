import "dotenv/config";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { ProjectModel } from "@/features/projects/models/project.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seed = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL;

    if (!mongoUrl) {
      throw new Error("MONGODB_URL is not in .env file");
    }

    await mongoose.connect(mongoUrl);

    const filePath = path.join(__dirname, "../data/db.json");
    const file = fs.readFileSync(filePath, "utf-8");
    const db = JSON.parse(file);

    await ProjectModel.deleteMany();
    await ProjectModel.insertMany(db.projects);

    console.log("Projects were seeded successfully");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seed();
