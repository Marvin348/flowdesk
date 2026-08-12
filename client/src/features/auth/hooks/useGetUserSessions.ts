import { useQuery } from "@tanstack/react-query";
import type { UserSessionDto } from "@shared/types/dto/session/session.dto";
import { getUserSessions } from "@/features/auth/api/auth.api";

export const useGetUserSessions = () => {
  const { data, isError, isLoading } = useQuery<UserSessionDto[], Error>({
    queryKey: ["auth", "sessions"],
    queryFn: getUserSessions,
  });

  return { data, isLoading, isError };
};
