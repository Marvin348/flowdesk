import { UserModel } from "@/features/users/models/user.modal.js";
import type { SeedUser } from "@/scripts/seed/types.js";

export const seedUsers = async (users: SeedUser[]) => {
  const userIdMap = new Map<string, string>();

  for (const user of users) {
    const createdUser = await UserModel.create({
      name: user.name,
      email: user.email,
      jobTitle: user.jobTitle,
      role: user.role,
      avatarKey: user.avatarKey,
    });

    userIdMap.set(user.id, createdUser._id.toString());
  }

  return userIdMap;
};
