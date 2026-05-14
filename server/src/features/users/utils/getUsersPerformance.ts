import { Task } from "@shared/types/task.js";
import { User } from "@shared/types/user.js";
import type { TeamMemberDto } from "@shared/types/dto/users/user.js";
import { getUserPerformance } from "@/features/users/utils/getUserPerformance.js";

export const getUsersPerformance = (
  users: User[],
  tasks: Task[],
): TeamMemberDto[] => {
  return users.map((user) => getUserPerformance(user, tasks));
};
