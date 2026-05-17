import { Button } from "@/shared/components/ui/button";
import type { Attachment } from "@shared/types/attachment";
import AttachmentUploadDropzone from "@/features/attachments/components/AttachmentUploadDropzone";
import AttachmentUploadQueue from "@/features/attachments/components/AttachmentUploadQueue";
import AttachmentsToolbar from "@/features/attachments/components/AttachmentsToolbar";
import AttachmentsTable from "@/features/attachments/components/AttachmentsTable";

type AttachmentsViewProps = {
  attachments: Attachment[];
};

const AttachmentsView = () => {
  return (
    <section>
      <AttachmentUploadDropzone />

      <div>
        <AttachmentUploadQueue />
      </div>

      <div>
        <AttachmentsToolbar />
        <AttachmentsTable />
      </div>
    </section>
  );
};
export default AttachmentsView;

// export type Attachment = {
//   id: string;
//   projectId: string;
//   taskId?: string | null;
//   userId: string;

//   fileName: string;
//   fileUrl: string;
//   mimeType: string;
//   fileSize: number;

//   createdAt: string;
// };

// dto
export type ProjectAttachmentDto = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  sizeLabel: string;

  uploadedAt: string;

  uploadedBy: {
    id: string;
    name: string;
    email?: string;
    avatarKey?: string;
  };

  task?: {
    id: string;
    title: string;
  } | null;
};

{
  /* <section className="border rounded-md">
      <div className="flex items-center justify-between p-4 bg-muted-foreground/10">
        <h4 className="font-medium text-lg">Anhänge</h4>
        <Button>
          <Plus className="text-accent" /> <span>Hinzufügen</span>
        </Button>
      </div>
      <div className="p-4">
        <p className="text-muted-foreground text-sm">Dokumente</p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          {/* {attachments.map((att) => (
            <div key={att.id} className="border rounded-md p-2">
              <AttachmentsCard attachment={att} />
            </div>
          ))} */
}
//     </div>
//   </div>
// </section> */}
