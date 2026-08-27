import { useEffect } from "react";
import { socket } from "@/realtime/socket";
import { useQueryClient } from "@tanstack/react-query";

export const useRealtimeNotifications = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.connect();

    const handleNewNotification = () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
      socket.disconnect();
    };
  }, [queryClient]);
};
