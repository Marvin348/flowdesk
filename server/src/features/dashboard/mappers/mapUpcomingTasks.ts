import type { Project } from "@shared/types/project.js";
import type { Task } from "@shared/types/task.js";
import type { UpcomingTaskDto } from "@shared/types/dto/dashboard/upcomingTask.dto.js";

// gets refactored, sorted by db
export const mapUpcomingTasks = (
  projects: Project[],
  tasks: Task[],
): UpcomingTaskDto[] => {
  const openTasks = tasks.filter((t) => t.taskStatus !== "done");

  const tasksSortedByDueDate = openTasks
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )
    .slice(0, 5);

  const projectsById = new Map(projects.map((p) => [p.id, p]));

  const upcomingTasks = tasksSortedByDueDate.map((t) => {
    const project = projectsById.get(t.projectId);

    return {
      taskId: t.id,
      taskTitle: t.title,
      projectTitle: project?.title,
      priority: t.taskPriority,
      dueDate: t.dueDate,
    };
  });

  return upcomingTasks;
};
