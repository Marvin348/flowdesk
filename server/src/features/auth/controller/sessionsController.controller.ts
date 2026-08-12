import type { Request, Response } from "express";
import { getAuthContext } from "@/features/auth/utils/getAuthContext";
import { getActiveSessionsForUser } from "@/features/sessions/services/getActiveSessionsForUser.service";

export const sessionsController = async (req: Request, res: Response) => {
  const { userId } = getAuthContext(req);
  const currentSessionId = req.cookies.sessionId;

  const userSessions = await getActiveSessionsForUser({
    userId,
    currentSessionId,
  });

  return res.status(200).json({ userSessions });
};
