import UploadQueueItem from "@/features/attachments/components/UploadQueueItem";

const AttachmentUploadQueue = () => {
  return (
    <div className="mb-6 space-y-3">
      <UploadQueueItem
        fileName="Tech requirements.pdf"
        fileSize="200 KB"
        progress={100}
        status="done"
      />

      <UploadQueueItem
        fileName="Dashboard prototype.mp4"
        fileSize="16 MB"
        progress={40}
        status="uploading"
      />
    </div>
  );
};
export default AttachmentUploadQueue;