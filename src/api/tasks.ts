import type { Task } from "@/type/task";
import { apiClient } from "@/api/client";
import type { CreateTaskInput } from "@/type/createTaskInput";

export const fetchTasks = async (projectId?: string): Promise<Task[]> => {
  const url = projectId ? `/tasks?projectId=${projectId}` : "/tasks";
  const res = await apiClient.get(url);
  return res.data;
};

export const createTask = async (input: CreateTaskInput): Promise<Task> => {
  const res = await apiClient.post(`/tasks`, {
    id: crypto.randomUUID(),
    projectId: input.projectId,
    title: input.title,
    dueDate: input.dueDate,
    taskStatus: "pending",
    collaboratorIds: input.collaboratorIds,
    description: input.description,
    tags: input.tags,
    reminderAt: input.reminderAt,
  });

  return res.data;
};
