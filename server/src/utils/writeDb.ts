import fs from "node:fs";
import path from "node:path";
import type { Database } from "../types/index.js";

const dbPath = path.resolve("src/data/db.json");

export const writeDb = (data: Database) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};
