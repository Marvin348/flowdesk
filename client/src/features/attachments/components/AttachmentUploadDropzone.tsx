import { Upload } from "lucide-react";
import { useRef } from "react";

const AttachmentUploadDropzone = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);


  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg,.docx,.mp4"
        className="hidden"
        // onChange={handleChange}
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
          PDF, PNG, JPG, DOCX oder MP4 bis max. 25 MB
        </p>
      </button>
    </div>
  );
};
export default AttachmentUploadDropzone;

{
  /* <div className="mb-4 rounded-md border border-dashed bg-muted/30 p-8 text-center">
      <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-background border">
        <Upload className="size-5 text-muted-foreground" />
      </div>

      <p className="text-sm font-medium">Datei auswählen oder hier ablegen</p>

      <p className="mt-1 text-xs text-muted-foreground">
        PDF, PNG, JPG, DOCX oder MP4 bis max. 25 MB
      </p>
    </div> */
}
