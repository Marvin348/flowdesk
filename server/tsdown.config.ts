import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "tsdown";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  entry: {
    server: "src/server.ts",
    deadlineJob: "src/jobs/deadlineJob.ts",
  },

  platform: "node",
  format: ["esm"],
  outDir: "dist",
  clean: true,

  inputOptions: {
    resolve: {
      alias: {
        "@": path.resolve(currentDirectory, "src"),
        "@shared": path.resolve(currentDirectory, "../shared"),
      },
    },
  },
});
