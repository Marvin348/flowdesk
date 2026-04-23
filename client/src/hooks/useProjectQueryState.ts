import type { ContentFilter } from "@shared/types/filter/contentFilter";
import type { Priority } from "@shared/types/priority";
import type { StatusBase } from "@shared/types/StatusBase";
import { useSearchParams } from "react-router";

export const useProjectQueryState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const priorityParams = searchParams.get("priority");
  const statusParams = searchParams.get("status");

  const priority: Priority | undefined =
    priorityParams === "low" ||
    priorityParams === "medium" ||
    priorityParams === "high"
      ? priorityParams
      : undefined;

  const status: StatusBase | undefined =
    statusParams === "pending" ||
    statusParams === "in_progress" ||
    statusParams === "done"
      ? statusParams
      : undefined;

  const hasAttachments =
    searchParams.get("hasAttachments") === "true"
      ? true
      : searchParams.get("hasAttachments") === "false"
        ? false
        : undefined;

  const setQueryParam = (key: string, value?: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      if (key !== "page") {
        params.set("page", "1");
      }

      return params;
    });
  };

  const filter: ContentFilter = {
    priority,
    status,
    hasAttachments,
  };

  const toggleFilter = <K extends keyof ContentFilter>(
    key: K,
    value: ContentFilter[K],
  ) => {
    const nextValue = filter[key] === value ? undefined : value;

    setQueryParam(key, nextValue === undefined ? undefined : String(nextValue));
  };

  const setPage = (newPage: number) => setQueryParam("page", String(newPage));

  const resetQueryParams = () => setSearchParams({ page: "1" });

  return {
    page,
    filter,
    actions: {
      setPage,
      resetQueryParams,
      toggleFilter,
    },
  };
};
