import type { Attachment } from "@/type/attachment";
import { apiClient } from "@/api/client";

export const fetchAttachments = async (
  taskId?: string,
): Promise<Attachment[]> => {
  const url = taskId ? `/attachments?taskId=${taskId}` : "/attachments";
  const res = await apiClient.get(url);
  return res.data;
};
