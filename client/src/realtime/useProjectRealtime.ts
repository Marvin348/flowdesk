import { useEffect } from "react";
import { socket } from "@/realtime/socket";
import { useQueryClient } from "@tanstack/react-query";

type JoinProjectAck =
  | { ok: true }
  | { ok: false; reason: "not_found" | "error" };

export const useProjectRealtime = (projectId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!projectId) return;

    const joinProject = () => {
      socket.emit("project:join", projectId, (ack: JoinProjectAck) => {
        if (!ack.ok) {
          console.warn("Failed to join project realtime room", ack.reason);
        }
      });
    };

    const handleTaskUpdated = () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "tasks"],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "details"],
      });
    };

    socket.on("connect", joinProject);
    socket.on("task:updated", handleTaskUpdated);
    socket.on("task:created", handleTaskUpdated);
    socket.on("task:status_changed", handleTaskUpdated);

    if (!socket.connected) {
      socket.connect();
    } else {
      joinProject();
    }

    return () => {
      socket.emit("project:leave", projectId);
      socket.off("connect", joinProject);
      socket.off("task:updated", handleTaskUpdated);
      socket.off("task:created", handleTaskUpdated);
      socket.off("task:status_changed", handleTaskUpdated);
    };
  }, [projectId, queryClient]);
};
