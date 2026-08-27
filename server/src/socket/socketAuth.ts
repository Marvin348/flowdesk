import { parseCookie } from "cookie";
import type { Socket } from "socket.io";
import { findSession } from "@/features/sessions/repository/session.repository";

export const socketAuth = async (
  socket: Socket,
  next: (error?: Error) => void,
) => {
  try {
    const cookieHeader = socket.request.headers.cookie;

    if (!cookieHeader) {
      return next(new Error("Unauthorized"));
    }

    const cookies = parseCookie(cookieHeader);
    const sessionId = cookies.sessionId;

    if (!sessionId) {
      return next(new Error("Unauthorized"));
    }

    const session = await findSession(sessionId);

    if (!session) {
      return next(new Error("Unauthorized"));
    }

    socket.data.userId = session.userId;

    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
};
