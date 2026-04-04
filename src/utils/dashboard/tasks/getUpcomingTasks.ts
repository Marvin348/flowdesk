import type { Priority } from "@/type/domain/priority";
import type { Project } from "@/type/domain/project";
import type { Task } from "@/type/domain/task";
import { getArrayLookup } from "@/utils/getArrayLookup";

export type UpcomingTask = {
  taskId: string;
  taskTitle: string;
  projectTitle?: string;
  priority: Priority;
  dueDate: string
}

export const getUpcomingTasks = (projects: Project[], tasks: Task[]): UpcomingTask[] => {
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
