import { fetchAttachments } from "@/api/attachments";
import type { Attachment } from "@/type/domain/attachment";
import { useQuery } from "@tanstack/react-query";

export const useTaskAttachments = (taskId: string) => {
  const { data, isLoading, error } = useQuery<Attachment[], Error>({
    queryKey: ["attachments", taskId],
    queryFn: () => fetchAttachments(taskId),
  });

  return { data, isLoading, error };
};
