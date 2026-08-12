export type SessionData = {
  userId: string;
  createdAt: string;
  absoluteExpiresAt: string;
  userAgent?: string;
  userIp?: string;
};

export type AddUserSession = {
  sessionId: string;
  userId: string;
};

export type RemoveUserSessions = {
  sessionIds: string[];
  userId: string;
};
