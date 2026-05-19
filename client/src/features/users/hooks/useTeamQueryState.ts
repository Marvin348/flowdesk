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
import { updateQueryParam } from "@/shared/utils/updateQueryParam";
import { DEFAULT_PAGE } from "@shared/constants/pagination";

export const useTeamQueryState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("teamPage")) || DEFAULT_PAGE;
  const search = searchParams.get("teamSearch") || "";

  const userRoleParam = searchParams.get("role");
  const sortParam = searchParams.get("sort");
  const progressParam = searchParams.get("progress");
  const activityParam = searchParams.get("activity");

  const role: UserRoleFilter = parseUserRoleParam(userRoleParam);
  const sort: TeamSort | undefined = parseSortParam(sortParam);
  const progress: TeamProgress | undefined = parseProgressParam(progressParam);
  const activity: TeamActivity | "all" = parseActivityParams(activityParam);

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

    return setSearchParams((prev) =>
      updateQueryParam(
        prev,
        key,
        nextValue === undefined ? undefined : String(nextValue),
        "teamPage",
      ),
    );
  };

  const resetTeamFilter = () =>
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      params.delete("role");
      params.delete("sort");
      params.delete("progress");
      params.delete("activity");

      params.set("teamPage", "1");

      return params;
    });

  const setPage = (value: number) =>
    setSearchParams((prev) =>
      updateQueryParam(prev, "teamPage", String(value)),
    );

  const setSearch = (value: string) =>
    setSearchParams((prev) =>
      updateQueryParam(prev, "teamSearch", value, "teamPage"),
    );

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
