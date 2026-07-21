import type { NewTaskFields } from "@/features/tasks/schemas/newTaskSchema";

export const getCreateTaskDefaultValues = (
  initialCollaboratorIds: string[],
): NewTaskFields => ({
  title: "",
  tags: [],
  reminderAt: "none",
  collaboratorIds: initialCollaboratorIds,
  description: "",
  dueDate: "",
  taskPriority: "low",
});
