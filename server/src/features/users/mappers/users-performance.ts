import { Task } from "@shared/types/task";
import { User } from "@shared/types/user";
import type { TeamMemberDto } from "@shared/types/dto/users/user";
import { toUserPerformanceDto } from "@/features/users/mappers/user-performance.mapper";


export const toUsersPerformanceDto = (
  users: User[],
  tasks: Task[],
): TeamMemberDto[] => {
  return users.map((user) => toUserPerformanceDto(user, tasks));
};
