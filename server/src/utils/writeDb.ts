import fs from "node:fs";
import path from "node:path";

const dbPath = path.resolve("src/data/db.json");

export const writeDb = (data: unknown) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};
