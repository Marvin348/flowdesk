import fs from "node:fs";
import path from "node:path";

const dbPath = path.resolve("src/data/db.json");

export const readDb = () => {
  const file = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(file);
};
