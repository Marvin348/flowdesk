import type { User } from "@shared/types/user.js";
import { toUserAvatarDto } from "@/features/users/mappers/user.mapper.js";
import type { ProjectTasksResponseDto } from "@shared/types/dto/projects/projectTasks.dto.js";
import { Task } from "@shared/types/task.js";
import { toTaskStatsDto } from "@/features/tasks/mappers/task-status.mapper.js";
import { isDefined } from "@/shared/utils/isDefined.js";

export const toProjectTasksDto = (
  tasks: Task[],
  usersById: Map<string, User>,
): ProjectTasksResponseDto => {
  const taskStats = toTaskStatsDto(tasks);

  const projectTasks = tasks.map((t) => {
    const collaborators = t.collaboratorIds
      .map((ids) => usersById.get(ids))
      .filter(isDefined)
      .map(toUserAvatarDto);

    return {
      ...t,
      collaborators,
    };
  });

  return {
    tasks: projectTasks,
    taskStats,
  };
};
