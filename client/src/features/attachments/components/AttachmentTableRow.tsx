import { Trash2, FileIcon, ExternalLink } from "lucide-react";
import type { ProjectAttachmentDto } from "@shared/types/dto/projects/projectAttachments.dto";
import Avatar from "@/shared/components/ui/avatar/Avatar";
import { formatDate } from "@/shared/utils/formatDate";
import { formatFileSize } from "@/shared/utils/formatFileSize";

type AttachmentTableRowProps = {
  attachment: ProjectAttachmentDto;
};
const AttachmentTableRow = ({ attachment }: AttachmentTableRowProps) => {
  return (
    <tr className="border-b last:border-b-0">
      <td className="px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
            <FileIcon className="size-4 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {attachment.fileName}
            </p>

            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <span>{formatFileSize(attachment.fileSize)}</span>

              <span className="md:hidden">•</span>

              <span className="md:hidden">
                {formatDate(attachment.uploadedAt)}
              </span>
            </div>

            <div className="mt-2 space-y-1 md:hidden">
              <p className="truncate text-xs text-muted-foreground">
                {attachment.task
                  ? `Aufgabe: ${attachment.task.title}`
                  : "Projektdatei"}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                Hochgeladen von {attachment.uploadedBy.name}
              </p>
            </div>
          </div>
        </div>
      </td>

      <td className="hidden px-4 py-3 md:table-cell">
        {attachment.task ? (
          <div>
            <p className="text-sm font-medium">Aufgabe</p>
            <p className="max-w-48 truncate text-xs text-muted-foreground">
              {attachment.task.title}
            </p>
          </div>
        ) : (
          <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
            Projektdatei
          </span>
        )}
      </td>

      <td className="hidden px-4 py-3 lg:table-cell">
        <div className="flex items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
            <Avatar avatarKey={attachment.uploadedBy.avatarKey} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {attachment.uploadedBy.name}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {attachment.uploadedBy.email}
            </p>
          </div>
        </div>
      </td>

      <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
        {formatDate(attachment.uploadedAt)}
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <a
            href={attachment.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Datei öffnen"
          >
            <ExternalLink className="size-4" />
          </a>

          <button
            type="button"
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
            aria-label="Datei löschen"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
export default AttachmentTableRow;
