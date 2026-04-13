import type { Attachment } from "@shared/types/attachment";
import { apiClient } from "@/api/client";

export const fetchAttachments = async (): Promise<Attachment[]> => {
  const res = await apiClient.get("/attachments");
  return res.data.data;
};