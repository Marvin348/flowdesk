import type { Priority } from "@shared/types/priority";
import type { Project } from "@shared/types/project";
import type { Task } from "@shared/types/task";
import { getArrayLookup } from "@/shared/utils/getArrayLookup";

export type UpcomingTask = {
  taskId: string;
  taskTitle: string;
  projectTitle?: string;
  priority: Priority;
  dueDate: string;
};

export const getUpcomingTasks = (
  projects: Project[],
  tasks: Task[],
): UpcomingTask[] => {
  const openTasks = tasks.filter((t) => t.taskStatus !== "done");

  const tasksSortedByDueDate = openTasks
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )
    .slice(0, 5);

  const projectsById = getArrayLookup(projects);

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
