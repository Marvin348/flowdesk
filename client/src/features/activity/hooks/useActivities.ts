import { useQuery } from "@tanstack/react-query";
import { fetchActivities } from "@/features/activity/api/activity.api";
import type { ActivityDto } from "@shared/types/dto/activity/activity.dto";

export const useActivities = () => {
  const { data, isLoading, error } = useQuery<ActivityDto[], Error>({
    queryKey: ["activity"],
    queryFn: fetchActivities,
  });

  return { data, isLoading, error };
};
