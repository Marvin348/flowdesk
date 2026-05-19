import { useSearchParams } from "react-router";
import { updateQueryParam } from "@/shared/utils/updateQueryParam";
import { DEFAULT_PAGE } from "@shared/constants/pagination";

export const useProjectAttachmentSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("filePage")) || DEFAULT_PAGE;
  const search = searchParams.get("fileSearch") || "";

  const setPage = (newPage: number) =>
    setSearchParams((prev) =>
      updateQueryParam(prev, "filePage", String(newPage)),
    );
  const setSearch = (value: string) =>
    setSearchParams((prev) =>
      updateQueryParam(prev, "fileSearch", value, "filePage"),
    );

  return { page, search, actions: { setPage, setSearch } };
};
