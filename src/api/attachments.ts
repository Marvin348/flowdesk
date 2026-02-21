import type { Attachment } from "@/type/attachment";
import { apiClient } from "@/api/client";

export const fetchAttachments = async (): Promise<Attachment[]> => {
  const res = await apiClient.get("/attachments");
  return res.data;
};
