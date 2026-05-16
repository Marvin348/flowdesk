import type { Comment } from "@shared/types/comment.js";
import type { Project } from "@shared/types/project.js";
import type { Task } from "@shared/types/task.js";
import type { User } from "@shared/types/user.js";
import { getProjectProgress } from "@/features/projects/utils/getProjectProgress.js";
import { toProjectUserWorkloadDto } from "@/features/projects/mappers/project-user-workload.mapper.js";
import type { ProjectOverviewDto } from "@shared/types/dto/projects/projectOverview.dto.js";
import { toUserPreviewDto } from "@/features/users/mappers/user.mapper.js";

export const toProjectOverviewDto = ({
  project,
  comments,
  tasks,
  usersById,
}: {
  project: Project;
  tasks: Task[];
  comments: Comment[];
  usersById: Map<string, User>;
}): ProjectOverviewDto => {
  const taskIdsSet = new Set(tasks.map((task) => task.id));

  const collaborators = project.invitedUserIds
    .map((userId) => usersById.get(userId))
    .filter((user): user is User => Boolean(user))
    .map(toUserPreviewDto)
    .slice(0, 4);

  const openTasks = tasks
    .filter((task) => task.taskStatus !== "done")
    .slice(0, 4)
    .map((task) => ({
      id: task.id,
      title: task.title,
      dueDate: task.dueDate,
      taskStatus: task.taskStatus,
      description: task.description,
      collaborators: task.collaboratorIds
        .map((userId) => usersById.get(userId))
        .filter((user): user is User => Boolean(user))
        .map(toUserPreviewDto),
    }));

  const recentComments = comments
    .filter((comment) => taskIdsSet.has(comment.taskId))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6)
    .map((comment) => ({
      id: comment.id,
      message: comment.message,
      createdAt: comment.createdAt,
      user: comment.userId
        ? usersById.get(comment.userId)
          ? toUserPreviewDto(usersById.get(comment.userId)!)
          : null
        : null,
    }));

  const progress = getProjectProgress(tasks);
  const workload = toProjectUserWorkloadDto(tasks, usersById).slice(0, 4);

  return {
    collaborators,
    openTasks,
    recentComments,
    progress,
    workload,
  };
};
