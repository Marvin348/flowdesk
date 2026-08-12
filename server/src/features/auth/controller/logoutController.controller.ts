import type { Request, Response } from "express";
import { deleteSession } from "@/features/sessions/repository/session.repository";
import { authCookieOptions } from "@/shared/config/auth-cookie";
import { getAuthContext } from "@/features/auth/utils/getAuthContext";
import { removeUserSessions } from "@/features/sessions/repository/userSessions.repository";

export const logoutController = async (req: Request, res: Response) => {
  const sessionId = req.cookies.sessionId;

  const { userId } = getAuthContext(req);

  if (sessionId) {
    await deleteSession(sessionId);
    await removeUserSessions({ userId, sessionIds: [sessionId] });
  }

  res.clearCookie("sessionId", authCookieOptions);

  return res.status(200).json({ message: "Logout successful" });
};
