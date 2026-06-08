declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        workspaceId: string;
        role: "member" | "manager" | "admin"
      };
    }
  }
}

export {};
