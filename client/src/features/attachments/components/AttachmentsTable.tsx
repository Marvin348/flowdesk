import AttachmentTableRow from "@/features/attachments/components/AttachmentTableRow";
import type { ProjectAttachmentDto } from "@shared/types/dto/projects/projectAttachments.dto";
import { ATTACHMENT_TABLE_HEADER } from "@/features/attachments/constants/attachmentTableHeader";

type AttachmentsTableProps = {
  attachments: ProjectAttachmentDto[];
};

const AttachmentsTable = ({ attachments }: AttachmentsTableProps) => {
  return (
    <div className="border rounded-md">
      <table className="w-full text-sm">
        <thead className="bg-muted text-sm text-left [&_th]:font-normal">
          <tr>
            {ATTACHMENT_TABLE_HEADER.map((a) => (
              <th className="py-3 px-4 text-left" key={a.value}>{a.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {attachments.map((a) => (
            <AttachmentTableRow key={a.id} attachment={a} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AttachmentsTable;
