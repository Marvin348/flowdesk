import { Trash2, FileIcon, ExternalLink } from "lucide-react";
const AttachmentTableRow = () => {
  return (
    <tr className="border-b last:border-b-0 hover:bg-muted/40">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
            <FileIcon className="size-4 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {}
            </p>
            <p className="text-xs text-muted-foreground">
              {}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        {/* { (
          <div>
            <p className="text-sm font-medium">Task</p>
            <p className="max-w-48 truncate text-xs text-muted-foreground">
              {}
            </p>
          </div>
        ) : (
          <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
            Projektdatei
          </span>
        )} */}
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
            {}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {}
            </p>

            { (
              <p className="truncate text-xs text-muted-foreground">
                {}
              </p>
            )}
          </div>
        </div>
      </td>

      <td className="px-4 py-4 text-sm text-muted-foreground">
        {}
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-2">
          <a
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
