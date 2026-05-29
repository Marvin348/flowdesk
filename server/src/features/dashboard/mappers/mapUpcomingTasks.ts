import type { Project } from "@shared/types/project.js";
import type { Task } from "@shared/types/task.js";
import type { UpcomingTaskDto } from "@shared/types/dto/dashboard/upcomingTask.dto.js";

export const mapUpcomingTasks = (
  projects: Project[],
  tasks: Task[],
): UpcomingTaskDto[] => {
  const projectsById = new Map(projects.map((p) => [p.id, p]));

  return tasks.map((t) => {
    const project = projectsById.get(t.projectId);

    return {
      taskId: t.id,
      taskTitle: t.title,
      projectTitle: project?.title,
      priority: t.taskPriority,
      dueDate: t.dueDate,
    };
  });
};
