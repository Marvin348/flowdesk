import AttachmentUploadDropzone from "@/features/attachments/components/AttachmentUploadDropzone";
import AttachmentUploadQueue from "@/features/attachments/components/AttachmentUploadQueue";
import AttachmentsToolbar from "@/features/attachments/components/AttachmentsToolbar";
import AttachmentsTable from "@/features/attachments/components/AttachmentsTable";
import { useProjectAttachments } from "@/features/projects/hooks/details/useProjectAttachments";
import { useProjectAttachmentSearchParams } from "@/features/projects/hooks/searchParams/useProjectAttachmentSearchParams";
import { useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import Pagination from "@/shared/components/ui/Pagination";
import { PAGE_LIMITS, DEFAULT_PAGE } from "@shared/constants/pagination";
import ProjectAttachmentSkeleton from "@/features/projects/components/projectDetailsPage/tabs/files/ProjectAttachmentSkeleton";

type AttachmentsViewProps = {
  projectId: string;
};

const AttachmentsView = ({ projectId }: AttachmentsViewProps) => {
  const { page, search, actions } = useProjectAttachmentSearchParams();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [searchInput, setSearchInput] = useState(search);
  const debounceInput = useDebounce(searchInput, 300);

  useEffect(() => {
    if (debounceInput !== search) {
      actions.setSearch(debounceInput);
    }
  }, [debounceInput]);

  const payload = {
    projectId,
    search,
    page,
    limit: PAGE_LIMITS.attachments,
  };

  const { data, isLoading, error } = useProjectAttachments(payload);

  const attachments = data?.items ?? [];
  const currentPage = data?.currentPage || DEFAULT_PAGE;
  const totalPages = data?.totalPages ?? 1;

  if (isLoading && !attachments.length) return <ProjectAttachmentSkeleton />;
  if (error) return <div>Etwas ist schief gelaufen</div>;

  const onFilesSelected = (files: File[]) =>
    setSelectedFiles((prev) => [...prev, ...files]);

  console.log("attachmentsDATA", data);

  return (
    <div className="flex flex-col flex-1">
      <AttachmentUploadDropzone onFilesSelected={onFilesSelected} />

      <div className="mb-6">
        <AttachmentUploadQueue selectedFiles={selectedFiles} />
      </div>

      <section>
        <AttachmentsToolbar
          searchInput={searchInput}
          onChange={setSearchInput}
        />
        <AttachmentsTable attachments={attachments} />
      </section>

      <div className="mt-auto pt-4 flex justify-end">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setPage={actions.setPage}
        />
      </div>
    </div>
  );
};
export default AttachmentsView;
