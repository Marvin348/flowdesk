import { Upload } from "lucide-react";

const AttachmentUploadDropzone = () => {
  return (
    <div className="mb-4 rounded-md border border-dashed bg-muted/30 p-8 text-center">
      <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-background border">
        <Upload className="size-5 text-muted-foreground" />
      </div>

      <p className="text-sm font-medium">Datei auswählen oder hier ablegen</p>

      <p className="mt-1 text-xs text-muted-foreground">
        PDF, PNG, JPG, DOCX oder MP4 bis max. 25 MB
      </p>
    </div>
  );
};
export default AttachmentUploadDropzone;
