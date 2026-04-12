import type { Attachment } from "@/type/domain/attachment";
import { File, Trash2, Download } from "lucide-react";

const AttachmentsCard = ({ attachment }: { attachment: Attachment }) => {
  const { fileName } = attachment;
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <File className="text-surface/80" />
          <p>{fileName}</p>
        </div>
        <div className="text-surface/80">
          <button className="transform duration-300 hover:text-surface/90">
            <Download className="size-5" />
          </button>
          <button className="ml-3 transform duration-300 hover:text-red-600">
            <Trash2 className="size-5" />
          </button>
        </div>
      </div>
    </>
  );
};
export default AttachmentsCard;
