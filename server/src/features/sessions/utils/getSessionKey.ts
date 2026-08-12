export const getSessionKey = (sessionId: string) => {
  return `session:${sessionId}`;
};

export const getUserSessionKey = (userId: string) => {
  return `user:sessions:${userId}`;
};
