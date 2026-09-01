import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { socketAuth } from "@/socket/socketAuth";
import { ProjectModel } from "@/features/projects/models/project.model";

type JoinProjectAck =
  | { ok: true }
  | { ok: false; reason: "not_found" | "error" };

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

    socket.on(
      "project:join",
      async (projectId, ack?: (result: JoinProjectAck) => void) => {
        try {
          const projectExists = await ProjectModel.exists({
            _id: projectId,
            workspaceId: socket.data.workspaceId,
          });

          if (!projectExists) {
            ack?.({ ok: false, reason: "not_found" });
            return;
          }

          await socket.join(`project:${projectId}`);

          ack?.({ ok: true });
        } catch {
          ack?.({ ok: false, reason: "error" });
        }
      },
    );

    socket.on("project:leave", (projectId) => {
      socket.leave(`project:${projectId}`);
    });

    socket.join(`user:${userId}`);

    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};
