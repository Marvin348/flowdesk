import "dotenv/config";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { seedUsers } from "@/scripts/seed/seedUsers";
import { seedProjects } from "@/scripts/seed/seedProjects";
import { seedTasks } from "@/scripts/seed/seedTasks";
import { seedComments } from "@/scripts/seed/seedComments";
import { seedAttachments } from "@/scripts/seed/seedAttachments";
import { clearDatabase } from "@/scripts/seed/clearDatabase";
import { Types } from "mongoose";
import { seedWorkspace } from "@/scripts/seed/seedWorkspace";

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

  const demoUserId = new Types.ObjectId();
  const demoWorkspaceId = new Types.ObjectId();

  await clearDatabase();
  console.log("Cleared database");

  await seedWorkspace({
    workspaceId: demoWorkspaceId,
    ownerId: demoUserId,
  });
  console.log("Seeded workspace");

  const userIdMap = await seedUsers(db.users, {
    demoUserId,
    workspaceId: demoWorkspaceId,
  });
  console.log("Seeded users");

  const projectIdMap = await seedProjects({
    projects: db.projects,
    userIdMap,
    workspaceId: demoWorkspaceId,
  });
  console.log("Seeded projects");

  const taskIdMap = await seedTasks({
    tasks: db.tasks,
    projectIdMap,
    userIdMap,
    workspaceId: demoWorkspaceId,
  });
  console.log("Seeded tasks");

  const commentIdMap = await seedComments({
    comments: db.comments,
    taskIdMap,
    userIdMap,
    workspaceId: demoWorkspaceId,
  });
  console.log("Seeded comments");

  await seedAttachments({
    attachments: db.attachments,
    projectIdMap,
    taskIdMap,
    userIdMap,
    workspaceId: demoWorkspaceId,
  });
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
