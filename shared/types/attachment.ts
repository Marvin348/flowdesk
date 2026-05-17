export type Attachment = {
  id: string;
  projectId: string;
  taskId?: string | null;
  userId: string;

  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;

  createdAt: string;
};