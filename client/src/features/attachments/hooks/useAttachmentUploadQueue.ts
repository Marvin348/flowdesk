import { useState } from "react";

export type SelectedUploadFile = {
  id: string;
  file: File;
};

export const useAttachmentUploadQueue = () => {
  const [selectedFiles, setSelectedFiles] = useState<SelectedUploadFile[]>([]);

  const onFilesSelected = (files: File[]) => {
    const uploadItems = files.map((f) => ({
      id: crypto.randomUUID(),
      file: f,
    }));

    setSelectedFiles((prev) => [...prev, ...uploadItems]);
  };

  const removeSelectedFile = (id: string) =>
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));

  const clearSelectedFiles = () => setSelectedFiles([]);

  const getUploadFiles = () => selectedFiles.map((item) => item.file);

  return {
    selectedFiles,
    onFilesSelected,
    removeSelectedFile,
    clearSelectedFiles,
    getUploadFiles,
  };
};
