import { Task } from "@shared/types/task.js";
import { User } from "@shared/types/user.js";
import type { TeamMemberDto } from "@shared/types/dto/users/user.js";
import { toUserPerformanceDto } from "@/features/users/mappers/user-performance.mapper.js";


export const toUsersPerformanceDto = (
  users: User[],
  tasks: Task[],
): TeamMemberDto[] => {
  return users.map((user) => toUserPerformanceDto(user, tasks));
};
