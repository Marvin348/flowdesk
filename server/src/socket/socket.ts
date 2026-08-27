import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { socketAuth } from "@/socket/socketAuth";

export const createSocketServer = (
  httpServer: HttpServer,
  clientUrl: string,
) => {
  const io = new Server(httpServer, {
    cors: {
      origin: clientUrl,
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    socket.join(`user:${userId}`);

    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};
