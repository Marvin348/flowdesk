import { fetchAttachments } from "@/features/attachments/api/attachments.api";
import type { Attachment } from "@shared/types/attachment";
import { useQuery } from "@tanstack/react-query";

export const useAttachments = () => {
  const { data, isLoading, error } = useQuery<Attachment[], Error>({
    queryKey: ["attachments"],
    queryFn: () => fetchAttachments(),
  });

  return { data, isLoading, error };
};
