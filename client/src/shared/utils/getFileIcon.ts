import {
  File,
  FileText,
  FileImage,
  FileVideo,
  FileArchive,
  FileSpreadsheet,
} from "lucide-react";

export const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return FileImage;
  if (mimeType.startsWith("video/")) return FileVideo;

  if (mimeType === "application/pdf") return FileText;

  if (
    mimeType.includes("word") ||
    mimeType.includes("document") ||
    mimeType === "text/plain"
  ) {
    return FileText;
  }

  if (
    mimeType.includes("excel") ||
    mimeType.includes("spreadsheet")
  ) {
    return FileSpreadsheet;
  }

  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("archive")
  ) {
    return FileArchive;
  }

  return File;
};