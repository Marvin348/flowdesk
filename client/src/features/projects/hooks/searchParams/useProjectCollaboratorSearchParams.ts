import { useSearchParams } from "react-router";
import type { CollaboratorSortKey } from "@/features/projects/components/projectDetailsPage/tabs/collaborators/CollaboratorsView";
import { parseCollaboratorSort } from "@shared/parsers/parseCollaboratorSort";
import { updateQueryParam } from "@/shared/utils/updateQueryParam";

export const useProjectCollaboratorSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const collaboratorsSortParam = searchParams.get("collaboratorsSort");
  const collaboratorsSort = parseCollaboratorSort(collaboratorsSortParam);

  const page = Number(searchParams.get("page")) || 1;

  const toggleCollaboratorSort = (sortKey: CollaboratorSortKey) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      const currentSort = params.get("collaboratorsSort");

      const nextSort =
        currentSort === `${sortKey}_asc` ? `${sortKey}_desc` : `${sortKey}_asc`;

      params.set("collaboratorsSort", nextSort);

      return params;
    });
  };

  const setPage = (newPage: number) =>
    setSearchParams((prev) => updateQueryParam(prev, "page", String(newPage)));

  return {
    page,
    collaboratorsSort,
    actions: { toggleCollaboratorSort, setPage },
  };
};
