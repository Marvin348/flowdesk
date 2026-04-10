import fs from "node:fs";
import path from "node:path";
import type { Database } from "../types/index.js";

const dbPath = path.resolve("src/data/db.json");

export const readDb = (): Database => {
  const file = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(file);
};
