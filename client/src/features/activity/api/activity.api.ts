import { apiClient } from "@/shared/api/client";
import type { ActivityDto } from "@shared/types/dto/activity/activity.dto";

export const fetchActivities = async (): Promise<ActivityDto[]> => {
  const res = await apiClient.get("/activity");
  return res.data.activities;
};
