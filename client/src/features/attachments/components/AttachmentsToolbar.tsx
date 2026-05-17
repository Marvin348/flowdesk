import { Search} from "lucide-react";

const AttachmentsToolbar = () => {
  return (
    <div className="flex justify-end border-b px-4 py-3">
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <input
          placeholder="Dateien suchen..."
          className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm"
        />
      </div>
    </div>
  );
};
export default AttachmentsToolbar;
