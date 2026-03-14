import { fetchAttachments } from "@/api/attachments";
import { useQuery } from "@tanstack/react-query";

export const useAttachments = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["attachments"],
    queryFn: () => fetchAttachments(),
  });

  return { data, isLoading, error };
};
