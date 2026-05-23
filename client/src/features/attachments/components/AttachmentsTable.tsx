import AttachmentTableRow from "@/features/attachments/components/AttachmentTableRow";
import type { ProjectAttachmentDto } from "@shared/types/dto/projects/projectAttachments.dto";
import { ATTACHMENT_TABLE_HEADER } from "@/features/attachments/constants/attachmentTableHeader";
import { useDeleteProjectAttachment } from "@/features/projects/hooks/mutations/useDeleteProjectAttachment";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { useState } from "react";

type AttachmentsTableProps = {
  attachments: ProjectAttachmentDto[];
  projectId: string;
};

const AttachmentsTable = ({
  attachments,
  projectId,
}: AttachmentsTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { mutate, error } = useDeleteProjectAttachment();

  const onFileDelete = (id: string) => {
    setDeletingId(id);

    const input = {
      projectId,
      fileId: id,
    };

    mutate(input, {
      onSuccess: () => {
        setDeletingId(null);
      },
    });
  };

  return (
    <div className="border rounded-md">
      {error && (
        <ErrorMessage
          message="Datei konnte nicht gelöscht werden. Bitte versuche es erneut."
          className="border-b rounded-t-md bg-destructive/10 px-4 py-3"
        />
      )}

      <table className="w-full text-sm">
        <thead className="bg-muted text-sm text-left [&_th]:font-normal [&_th:last-child]:text-right">
          <tr className="[&_td:last-child]:text-right">
            {ATTACHMENT_TABLE_HEADER.map((a) => (
              <th className="py-3 px-4 text-left" key={a.value}>
                {a.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {attachments.map((a) => (
            <AttachmentTableRow
              key={a.id}
              attachment={a}
              onFileDelete={() => onFileDelete(a.id)}
              isDeleting={deletingId === a.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AttachmentsTable;
