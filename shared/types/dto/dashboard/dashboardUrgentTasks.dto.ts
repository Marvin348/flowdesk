import type { StatusBase } from "../../StatusBase";
import type { Priority } from "../../Priority";

export type DashboardUrgentTask = {
  id: string;
  title: string;
  dueDate: string;
  taskStatus: StatusBase;
  taskPriority: Priority;
  project: {
    id: string;
    title: string;
  };
};

export type DashboardUrgentTaskDto = {
  dueThisWeek: {
    total: number;
    items: DashboardUrgentTask[];
  };
  overdue: {
    total: number;
    items: DashboardUrgentTask[];
  };
};
