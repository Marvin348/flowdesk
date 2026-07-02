import { UserModel } from "@/features/users/models/user.modal.js";
import type { SeedUser } from "@/scripts/seed/types.js";
import { hashPassword } from "@/features/auth/utils/password.js";
import { Types } from "mongoose";

export const seedUsers = async (
  users: SeedUser[],
  {
    demoUserId,
    workspaceId,
  }: {
    demoUserId: Types.ObjectId;
    workspaceId: Types.ObjectId;
  },
) => {
  const userIdMap = new Map<string, string>();

  const DEMO_LOGIN_USER = {
    id: "demo-user",
    name: "Demo User",
    email: "demo@flowdesk.dev",
    jobTitle: "Project Manager",
    role: "admin",
  } as const;

  const DEMO_PASSWORD = "Demo1234!";

  const demoPasswordHash = await hashPassword(DEMO_PASSWORD);

  const usersToSeed: SeedUser[] = [DEMO_LOGIN_USER, ...users];

  for (const user of usersToSeed) {
    const mongoUserId =
      user.id === "demo-user" ? demoUserId : new Types.ObjectId();

    const createdUser = await UserModel.create({
      _id: mongoUserId,
      name: user.name,
      email: user.email,
      jobTitle: user.jobTitle,
      role: user.role,
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      ...(user.avatarKey ? { avatarKey: user.avatarKey } : {}),
      passwordHash: demoPasswordHash,
      workspaceId,
    });

    userIdMap.set(user.id, createdUser._id.toString());
  }

  return userIdMap;
};
