import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/features/auth/utils/tokens.js";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const payload = verifyAccessToken(token);

    if (typeof payload === "string" || !payload.sub) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userId = payload.sub;

    req.user = { id: userId };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authenticated" });
  }
};
