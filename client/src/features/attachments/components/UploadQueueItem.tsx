type UploadQueueItemProps = {
  fileName: string;
  fileSize: string;
  progress: number;
  status: "uploading" | "done" | "error";
};

const UploadQueueItem = ({
  fileName,
  fileSize,
  progress,
  status,
}: UploadQueueItemProps) => {
  return (
    <div className="rounded-md border p-4">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium">{fileName}</p>
          <p className="text-xs text-muted-foreground">{fileSize}</p>
        </div>

        <span className="text-xs text-muted-foreground">{progress}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default UploadQueueItem;
