import "dotenv/config";

import app from "@/app";
import { connectDb } from "@/shared/config/db";
import { registerNotificationHandlers } from "@/features/notification/events/registerNotificationHandlers";

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";

const startServer = async () => {
  try {
    await connectDb();

    registerNotificationHandlers();

    app.listen(PORT, HOST, () => {
      console.log(`server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exitCode = 1;
  }
};

startServer();
