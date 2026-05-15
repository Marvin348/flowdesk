import "dotenv/config";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { CommentModel } from "@/features/comments/models/comment.model.js";
import { AttachmentModel } from "@/features/attchments/models/attachment.model.js";
import { UserModel } from "@/features/users/models/user.modal.js";

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

    await CommentModel.deleteMany();
    await AttachmentModel.deleteMany();
    await TaskModel.deleteMany();
    await ProjectModel.deleteMany();
    await UserModel.deleteMany();

    await UserModel.insertMany(db.users);
    await ProjectModel.insertMany(db.projects);
    await TaskModel.insertMany(db.tasks);
    await CommentModel.insertMany(db.comments);
    await AttachmentModel.insertMany(db.attachments);

    console.log("Database were seeded successfully");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seed();
