import { Upload } from "lucide-react";
import React, { useRef } from "react";

type AttachmentUploadDropzoneProps = {
  onFilesSelected: (files: File[]) => void;
};

const AttachmentUploadDropzone = ({
  onFilesSelected,
}: AttachmentUploadDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;

    if (!file) return;

    onFilesSelected(Array.from(file));

    event.target.value = "";
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg,.docx,.mp4"
        className="hidden"
        onChange={handleChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mb-4 w-full rounded-md border border-dashed bg-muted/30 p-8 text-center hover:bg-muted/70"
      >
        <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full border bg-background">
          <Upload className="size-5 text-muted-foreground" />
        </div>

        <p className="text-sm font-medium">Datei auswählen</p>

        <p className="mt-1 text-xs text-muted-foreground">
          PDF, PNG, JPG, DOCX oder MP4 bis max. 5 MB
        </p>
      </button>
    </div>
  );
};
export default AttachmentUploadDropzone;
