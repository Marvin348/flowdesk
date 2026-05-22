import UploadQueueItem from "@/features/attachments/components/UploadQueueItem";
import type { SelectedUploadFile } from "@/features/attachments/hooks/useAttachmentUploadQueue";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";

type AttachmentUploadQueueProps = {
  selectedFiles: SelectedUploadFile[];
  removeSelectedFile: (id: string) => void;
  onUploadFiles: () => void;
  isUploading: boolean;
};

const AttachmentUploadQueue = ({
  selectedFiles,
  removeSelectedFile,
  onUploadFiles,
  isUploading,
}: AttachmentUploadQueueProps) => {
  return (
    <>
      {selectedFiles.length > 0 && (
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium">Ausgewählte Dateien</p>

          <Button
            type="button"
            disabled={selectedFiles.length === 0}
            onClick={onUploadFiles}
          >
            Hochladen {isUploading && <Spinner />}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {selectedFiles.map((file) => (
          <UploadQueueItem
            key={file.id}
            item={file}
            removeSelectedFile={() => removeSelectedFile(file.id)}
          />
        ))}
      </div>
    </>
  );
};
export default AttachmentUploadQueue;
