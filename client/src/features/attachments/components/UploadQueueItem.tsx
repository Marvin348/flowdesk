import { formatFileSize } from "@/shared/utils/formatFileSize";
import { X } from "lucide-react";
import { getFileIcon } from "@/shared/utils/getFileIcon";

type UploadQueueItemProps = {
  fileName: string;
  fileSize: number;
  mimeType: string;
};

const UploadQueueItem = ({
  fileName,
  fileSize,
  mimeType,
}: UploadQueueItemProps) => {
  const FileIcon = getFileIcon(mimeType);
  return (
    <div className="rounded-md border p-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
            <FileIcon className="size-4 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{fileName}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(fileSize)} · Bereit zum Hochladen
            </p>
          </div>
        </div>

        <button
          type="button"
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Datei entfernen"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default UploadQueueItem;
