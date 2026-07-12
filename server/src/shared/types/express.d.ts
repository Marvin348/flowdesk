import type { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        workspaceId: Types.ObjectId;
        role: "member" | "manager" | "admin";
      };
    }
  }
}

export {};
