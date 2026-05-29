import { useQuery } from "@tanstack/react-query";
import { fetchDashboardOverview } from "@/features/dashboard/api/dashboard.api";
import type { DashboardOverviewDto } from "@shared/types/dto/dashboard/dashboardOverview.dto";

export const useDashboardOverview = () => {
  const { data, isLoading, error } = useQuery<DashboardOverviewDto, Error>({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardOverview,
  });

  return { data, isLoading, error };
};
