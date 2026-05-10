import { useSearchParams } from "react-router";
import type { CollaboratorSortKey } from "@/features/projects/components/projectDetailsPage/tabs/collaborators/CollaboratorsView";
import { parseCollaboratorSort } from "@shared/parsers/parseCollaboratorSort";

export const useProjectCollaboratorQueryState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const collaboratorsSortParam = searchParams.get("collaboratorsSort");
  const collaboratorsSort = parseCollaboratorSort(collaboratorsSortParam);

  const page = Number(searchParams.get("page")) || 1;

  const setQueryParam = (key: string, value?: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      return params;
    });
  };

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

  const setPage = (newPage: number) => setQueryParam("page", String(newPage));

  return {
    page,
    collaboratorsSort,
    actions: { toggleCollaboratorSort, setPage },
  };
};
