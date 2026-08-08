import { toIsoString } from "@/utils/toIsoString";
import { Priority } from "@shared/types/Priority";
import { StatusBase } from "@shared/types/StatusBase";
import { Types } from "mongoose";

export type DashboardUrgentTaskAggregationItem = {
  _id: Types.ObjectId;
  title: string;
  taskStatus: StatusBase;
  taskPriority: Priority;
  dueDate: Date;
  project: {
    _id: Types.ObjectId;
    title: string;
  };
};

export type DashboardUrgentTasksAggregationResult = {
  dueThisWeekItems: DashboardUrgentTaskAggregationItem[];
  overdueItems: DashboardUrgentTaskAggregationItem[];

  dueThisWeekTotal: number;
  overdueTotal: number;
};

export const mapUrgentTask = (urgentTasks: DashboardUrgentTaskAggregationItem) => ({
  id: urgentTasks._id.toString(),
  title: urgentTasks.title,
  dueDate: toIsoString(urgentTasks.dueDate),
  taskStatus: urgentTasks.taskStatus,
  taskPriority: urgentTasks.taskPriority,

  project: {
    id: urgentTasks.project._id.toString(),
    title: urgentTasks.project.title,
  },
});
