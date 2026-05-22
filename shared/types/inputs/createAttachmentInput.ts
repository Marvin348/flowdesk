export type UploadProjectAttachmentsInput = {
  projectId: string;
  taskId: string | null;
  files: File[];
};
