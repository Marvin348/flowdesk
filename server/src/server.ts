import "dotenv/config";

import app from "@/app";
import { connectDb } from "@/shared/config/db";
import { registerTaskNotificationHandlers } from "@/features/notification/events/registerTaskNotificationHandlers";

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";

const startServer = async () => {
  await connectDb();

  registerTaskNotificationHandlers();

  app.listen(PORT, HOST, () => {
    console.log(`server running on port ${PORT}`);
  });
};

startServer();
