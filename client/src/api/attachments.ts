import type { Attachment } from "@/type/domain/attachment";
import { apiClient } from "@/api/client";

export const fetchAttachments = async (): Promise<Attachment[]> => {
  const res = await apiClient.get("/attachments");
  return res.data.data;
};

// export const fetchAttachments = async (
//   taskId?: string,
// ): Promise<Attachment[]> => {
//   const url = taskId ? `/attachments?taskId=${taskId}` : "/attachments";
//   const res = await apiClient.get(url);
//   return res.data;
// };
