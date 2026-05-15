import type { User } from "@shared/types/user.js";
import { toUserPreviewDto } from "@/features/users/mappers/user.mapper.js";
import type { ProjectTaskDto } from "@shared/types/dto/projects/projectTasks.dto.js";
import { Task } from "@shared/types/task.js";

export const getProjectTasks = (
  tasks: Task[],
  usersById: Map<string, User>,
): ProjectTaskDto[] => {
  return tasks.map((t) => {
    const collaborators = t.collaboratorIds
      .map((ids) => usersById.get(ids))
      .filter((user): user is User => Boolean(user))
      .map(toUserPreviewDto);

    return {
      ...t,
      collaborators,
    };
  });
};
