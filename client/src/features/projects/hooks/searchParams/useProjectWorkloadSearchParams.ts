import { useSearchParams } from "react-router";
import { parseProjectWorkloadSort } from "@shared/parsers/parseProjectWorkloadSort";
import { updateQueryParam } from "@/shared/utils/updateQueryParam";
import type { WorkloadSortKey } from "@/features/users/components/workload/WorkloadTable";

export const useProjectWorkloadSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const workloadSort = parseProjectWorkloadSort(
    searchParams.get("workloadSort"),
  );

  const setPage = (newPage: number) =>
    setSearchParams((prev) => updateQueryParam(prev, "page", String(newPage)));

  const toggleWorkloadSort = (sortKey: WorkloadSortKey) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      const workloadSort = params.get("workloadSort");

      const nextValue =
        workloadSort === `${sortKey}_asc`
          ? `${sortKey}_desc`
          : `${sortKey}_asc`;

      params.set("workloadSort", nextValue);

      return params;
    });
  };

  return { page, workloadSort, actions: { setPage, toggleWorkloadSort } };
};
