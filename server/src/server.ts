import "dotenv/config";

import app from "@/app";
import { connectDb } from "@/shared/config/db";
import { connectRedis, connectRedisSubscriber } from "@/shared/config/redis";
import { createServer } from "http";
import { createSocketServer } from "@/socket/socket";
import { connectRealtimeSubscriber } from "@/socket/realtimeSubscriber";
import { recoverPendingEmailDeliveries } from "./features/emailDelivery/services/recoverPendingEmailDeliveries";

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";

const CLIENT_URL = process.env.CLIENT_URL;

if (!CLIENT_URL) {
  throw new Error("CLIENT_URL is not defined");
}

const httpServer = createServer(app);

const io = createSocketServer(httpServer, CLIENT_URL);

const startServer = async () => {
  try {
    await connectDb();
    await connectRedis();
    await connectRedisSubscriber();

    await connectRealtimeSubscriber(io);

    try {
      await recoverPendingEmailDeliveries();
    } catch (error) {
      console.error("Failed to recover pending email deliveries:", error);
    }

    httpServer.listen(PORT, HOST, () => {
      console.log(`server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exitCode = 1;
  }
};

startServer();
