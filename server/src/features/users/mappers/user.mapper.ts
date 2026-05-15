import { User } from "@shared/types/user.js";

type UserDbRecord = User & {
  _id?: unknown;
  __v?: number;
};

export const toUserDto = (user: UserDbRecord): User => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarKey: user.avatarKey,
  };
};
