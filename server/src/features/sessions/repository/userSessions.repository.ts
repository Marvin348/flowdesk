import { redisClient } from "@/shared/config/redis";
import { getUserSessionKey } from "@/features/sessions/utils/getSessionKey";
import type {
  AddUserSession,
  RemoveUserSessions,
} from "@/features/sessions/types/session.types";

export const addUserSessions = async ({
  sessionId,
  userId,
}: AddUserSession) => {
  await redisClient.sAdd(getUserSessionKey(userId), sessionId);
};

export const getUserSessions = async (userId: string) => {
  return redisClient.sMembers(getUserSessionKey(userId));
};

export const removeUserSessions = async ({
  userId,
  sessionIds,
}: RemoveUserSessions) => {
  await redisClient.sRem(getUserSessionKey(userId), sessionIds);
};
