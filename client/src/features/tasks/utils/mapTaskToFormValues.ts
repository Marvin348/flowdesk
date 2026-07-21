import type { Task } from "@shared/types/task";
import type { NewTaskFields } from "@/features/tasks/schemas/newTaskSchema";

export const mapTaskToFormValues = (
  task: Task,
): NewTaskFields => ({
  title: task.title,
  tags: task.tags,
  reminderAt: task.reminderAt,
  collaboratorIds: task.collaboratorIds,
  description: task.description,
  taskPriority: task.taskPriority,
  dueDate: task.dueDate.slice(0, 10),
});