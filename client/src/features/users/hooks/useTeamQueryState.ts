import type {
  TeamSort,
  TeamProgress,
  TeamActivity,
  UserRoleFilter,
  TeamUiFilter,
} from "@shared/types/teamFilter/teamFilter";
import {
  parseActivityParams,
  parseProgressParam,
  parseSortParam,
  parseUserRoleParam,
} from "@/features/users/utils/teamQueryParsers";
import { useSearchParams } from "react-router";

export const useTeamQueryState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const userRoleParam = searchParams.get("role");
  const sortParam = searchParams.get("sort");
  const progressParam = searchParams.get("progress");
  const activityParam = searchParams.get("activity");

  const role: UserRoleFilter = parseUserRoleParam(userRoleParam);
  const sort: TeamSort | undefined = parseSortParam(sortParam);
  const progress: TeamProgress | undefined = parseProgressParam(progressParam);
  const activity: TeamActivity | "all" = parseActivityParams(activityParam);

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

  const teamFilter: TeamUiFilter = {
    role,
    sort,
    progress,
    activity,
  };

  const toggleTeamFilter = <K extends keyof TeamUiFilter>(
    key: K,
    value: TeamUiFilter[K],
  ) => {
    const nextValue = teamFilter[key] === value ? undefined : value;

    return setQueryParam(
      key,
      nextValue === undefined ? undefined : String(nextValue),
    );
  };

  const resetTeamFilter = () =>
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      params.delete("role");
      params.delete("sort");
      params.delete("progress");
      params.delete("activity");

      params.set("page", "1");

      return params;
    });

  const setPage = (value: number) => setQueryParam("page", String(value));
  const setSearch = (value: string) => setQueryParam("search", value);

  return {
    page,
    search,
    teamFilter,
    actions: {
      setPage,
      setSearch,
      toggleTeamFilter,
      resetTeamFilter,
    },
  };
};
