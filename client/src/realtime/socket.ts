import { io } from "socket.io-client";
import { API_BASE_URL } from "@/shared/api/client";

export const socket = io(API_BASE_URL, {
  withCredentials: true,
  autoConnect: false,
});

export const disconnectSocket = () => {
  socket.disconnect();
};
