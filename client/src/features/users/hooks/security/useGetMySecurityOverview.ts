import { useQuery } from "@tanstack/react-query";
import { getMySecurityOverview } from "@/features/users/api/users.api";
import type { UserSecurityOverviewDto } from "@shared/types/user";

export const useGetMySecurityOverview = () => {
  return useQuery<UserSecurityOverviewDto, Error>({
    queryFn: getMySecurityOverview,
    queryKey: ["users", "me", "security"],
  });
};
