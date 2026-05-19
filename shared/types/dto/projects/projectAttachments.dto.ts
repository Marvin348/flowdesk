export type ProjectAttachmentDto = {
  id: string;
  projectId: string;
  taskId?: string | null;
  userId: string;

  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;

  uploadedAt: string;

  uploadedBy: {
    id: string;
    name: string;
    email: string;
    avatarKey: string;
  };

  task?: {
    id: string;
    title: string;
  } | null;
};

export type ProjectAttachmentResponseDto = {
  items: ProjectAttachmentDto[];
  totalPages: number;
  currentPage: number;
};
