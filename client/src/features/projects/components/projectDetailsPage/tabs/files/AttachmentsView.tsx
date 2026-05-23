import AttachmentUploadDropzone from "@/features/attachments/components/AttachmentUploadDropzone";
import AttachmentUploadQueue from "@/features/attachments/components/AttachmentUploadQueue";
import AttachmentsToolbar from "@/features/attachments/components/AttachmentsToolbar";
import AttachmentsTable from "@/features/attachments/components/AttachmentsTable";
import { useProjectAttachments } from "@/features/projects/hooks/details/useProjectAttachments";
import { useProjectAttachmentSearchParams } from "@/features/projects/hooks/searchParams/useProjectAttachmentSearchParams";
import { useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import Pagination from "@/shared/components/ui/Pagination";
import { PAGE_LIMITS, DEFAULT_PAGE } from "@shared/constants/pagination";
import ProjectAttachmentListSkeleton from "@/features/projects/components/projectDetailsPage/tabs/files/ProjectAttachmentListSkeleton";
import { useCreateAttachment } from "@/features/projects/hooks/mutations/useCreateAttachment";
import { useAttachmentUploadQueue } from "@/features/attachments/hooks/useAttachmentUploadQueue";
import ErrorMessage from "@/shared/components/ErrorMessage";

type AttachmentsViewProps = {
  projectId: string;
};

const AttachmentsView = ({ projectId }: AttachmentsViewProps) => {
  const { page, actions } = useProjectAttachmentSearchParams();

  const [searchInput, setSearchInput] = useState("");
  const debounceInput = useDebounce(searchInput, 300);

  const query = {
    projectId,
    search: debounceInput,
    page,
    limit: PAGE_LIMITS.attachments,
  };

  const { data, isLoading, error } = useProjectAttachments(query);

  const attachments = data?.items ?? [];
  const currentPage = data?.currentPage || DEFAULT_PAGE;
  const totalPages = data?.totalPages ?? 1;

  const {
    selectedFiles,
    onFilesSelected,
    removeSelectedFile,
    clearSelectedFiles,
    getUploadFiles,
  } = useAttachmentUploadQueue();

  const {
    mutate: uploadAttachments,
    isPending: isUploading,
    error: uploadError,
  } = useCreateAttachment();

  const onUploadFiles = () => {
    const uploadInput = {
      projectId,
      taskId: null, // test
      files: getUploadFiles(),
    };

    uploadAttachments(uploadInput, {
      onSuccess: () => {
        clearSelectedFiles();
      },
    });
  };

  return (
    <div className="flex flex-col flex-1">
      <AttachmentUploadDropzone onFilesSelected={onFilesSelected} />

      <div className="mb-6">
        <AttachmentUploadQueue
          selectedFiles={selectedFiles}
          removeSelectedFile={removeSelectedFile}
          onUploadFiles={onUploadFiles}
          isUploading={isUploading}
        />
      </div>

      {uploadError && (
        <div className="text-sm text-destructive">
          Datei konnte nicht hochgeladen werden. Bitte versuche es erneut.
        </div>
      )}

      <section>
        <AttachmentsToolbar
          searchInput={searchInput}
          onChange={setSearchInput}
        />

        {error ? (
          <ErrorMessage
            message="Etwas ist schief gelaufen"
            className="mt-12 text-center"
          />
        ) : isLoading && !attachments.length ? (
          <ProjectAttachmentListSkeleton />
        ) : !isLoading && !attachments.length ? (
          <div className="mt-4 text-muted-foreground text-center">
            Keine Dateien gefunden
          </div>
        ) : (
          <AttachmentsTable attachments={attachments} projectId={projectId} />
        )}
      </section>

      {totalPages > 0 && (
        <div className="mt-auto pt-4 flex justify-end">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setPage={actions.setPage}
          />
        </div>
      )}
    </div>
  );
};
export default AttachmentsView;
