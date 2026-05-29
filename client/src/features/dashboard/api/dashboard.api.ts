import { apiClient } from "@/shared/api/client";
import type { DashboardOverviewDto } from "@shared/types/dto/dashboard/dashboardOverview.dto";

export const fetchDashboardOverview =
  async (): Promise<DashboardOverviewDto> => {
    const res = await apiClient.get("/dashboard");
    return res.data.data;
  };
