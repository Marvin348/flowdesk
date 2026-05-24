import "dotenv/config";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { seedUsers } from "@/scripts/seed/seedUsers.js";
import { seedProjects } from "@/scripts/seed/seedProjects.js";
import { seedTasks } from "@/scripts/seed/seedTasks.js";
import { seedComments } from "@/scripts/seed/seedComments.js";
import { seedAttachments } from "@/scripts/seed/seedAttachments.js";
import { clearDatabase } from "@/scripts/seed/clearDatabase.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seed = async () => {
  const mongoUrl = process.env.MONGODB_URL;

  if (!mongoUrl) {
    throw new Error("MONGODB_URL is not in .env file");
  }

  await mongoose.connect(mongoUrl);

  const filePath = path.join(__dirname, "../data/db.json");
  const file = fs.readFileSync(filePath, "utf-8");
  const db = JSON.parse(file);

  await clearDatabase();
  console.log("Cleared database");

  const userIdMap = await seedUsers(db.users);
  console.log("Seeded users");

  const projectIdMap = await seedProjects(db.projects, userIdMap);
  console.log("Seeded projects");

  const taskIdMap = await seedTasks(db.tasks, projectIdMap, userIdMap);
  console.log("Seeded tasks");

  const commentIdMap = await seedComments(db.comments, taskIdMap, userIdMap);
  console.log("Seeded comments");

  await seedAttachments(db.attachments, projectIdMap, taskIdMap, userIdMap);
  console.log("Seeded attachments");

  console.log("Database was seeded successfully");
};
seed()
  .catch((error) => {
    console.error("Seeding failed");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
