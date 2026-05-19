import UploadQueueItem from "@/features/attachments/components/UploadQueueItem";
import { Button } from "@/shared/components/ui/button";

type AttachmentUploadQueueProps = {
  selectedFiles: File[];
};

const AttachmentUploadQueue = ({
  selectedFiles,
}: AttachmentUploadQueueProps) => {
  return (
    <>
      {selectedFiles.length > 0 && (
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium">Ausgewählte Dateien</p>

          <Button type="button" disabled={selectedFiles.length === 0}>
            Hochladen
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {selectedFiles.map((file) => (
          <UploadQueueItem
            key={`${file.name}-${file.size}-${file.lastModified}`}
            fileName={file.name}
            fileSize={file.size}
            mimeType={file.type}
          />
        ))}
      </div>
    </>
  );
};
export default AttachmentUploadQueue;
