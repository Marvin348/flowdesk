import { UserModel } from "@/features/users/models/user.modal.js";
import type { SeedUser } from "@/scripts/seed/types.js";
import { hashPassword } from "@/features/auth/utils/password.js";

export const seedUsers = async (users: SeedUser[]) => {
  const userIdMap = new Map<string, string>();

  const DEMO_LOGIN_USER = {
    id: "demo-user",
    name: "Demo User",
    email: "demo@flowdesk.dev",
    jobTitle: "Project Manager",
    role: "admin",
    avatarKey: "default",
  } as const;

  const DEMO_PASSWORD = "Demo1234!";

  const demoPasswordHash = await hashPassword(DEMO_PASSWORD);

  const usersToSeed = [DEMO_LOGIN_USER, ...users];

  for (const user of usersToSeed) {
    const createdUser = await UserModel.create({
      name: user.name,
      email: user.email,
      jobTitle: user.jobTitle,
      role: user.role,
      avatarKey: user.avatarKey,
      passwordHash: demoPasswordHash,
    });

    userIdMap.set(user.id, createdUser._id.toString());
  }

  return userIdMap;
};
