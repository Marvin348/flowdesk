import { UserModel } from "@/features/users/models/user.modal.js";
import type { SeedUser } from "@/scripts/seed/types.js";
import { hashPassword } from "@/features/auth/utils/password.js";

export const seedUsers = async (users: SeedUser[]) => {
  const userIdMap = new Map<string, string>();

  const demoPasswordHash = await hashPassword("Demo1234!");

  for (const user of users) {
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
